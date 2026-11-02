import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { prisma } from '@autoesperto/database';
import { createApp } from '../src/app';
import { getStripe, premiumCheckoutParams, syncStripeSubscription } from '../src/services/billing';
import { subscriptionHasAccess, calculateAccountEntitlement } from '../src/services/entitlement';
import { signAuthToken } from '../src/services/auth';

let server: Server;
let base='';
let current: any = null;
let history: any[]=[];
let openSessions: any[]=[];
let created: any = null;
let stripeSub: any;
let creates=0;
const events=new Map<string,any>();
const undo:Array<()=>void>=[];
function stub(target:any,name:string,value:any){const old=target[name];undo.push(()=>{target[name]=old;});target[name]=value;}
function activeSub(status='trialing',end=Math.floor(Date.now()/1000)+7*86400){return {id:'sub_trial_test',status,metadata:{userId:'test-user',plan:'PREMIUM_MONTHLY',product:'premium_subscription'},customer:'cus_trial_test',trial_end:end,cancel_at_period_end:false,canceled_at:null,items:{data:[{price:{id:'price_test'},current_period_end:end}]}} as any;}
before(async()=>{
  process.env.JWT_SECRET='unit-test-secret-for-subscriptions-only-2026';
  process.env.STRIPE_SECRET_KEY='sk_test_unit_only';
  process.env.STRIPE_WEBHOOK_SECRET='whsec_unit_only';
  const stripe=getStripe();
  stub(prisma.user,'findUnique',async()=>({id:'test-user',email:'tester@example.invalid',emailVerified:new Date(),guestTrialUsedAt:null,purchases:[],subscription:current}));
  stub(prisma.analysis,'count',async()=>0);
  stub(prisma.analysis,'create',async({data}:any)=>({id:'saved-report',createdAt:new Date(),...data}));
  stub(prisma.subscription,'findUnique',async()=>current);
  stub(prisma.subscription,'findFirst',async()=>current);
  stub(prisma.subscription,'upsert',async({create,update}:any)=>{current=current?{...current,...update}:{id:'db-sub',...create};return current;});
  stub(prisma.subscription,'update',async({data}:any)=>{current={...current,...data};return current;});
  stub(prisma.analyticsEvent,'create',async({data}:any)=>data);
  stub(prisma.analyticsEvent,'upsert',async({where,create}:any)=>{if(!events.has(where.id))events.set(where.id,create);return events.get(where.id);});
  stub(stripe.customers,'create',async()=>({id:'cus_trial_test'}));
  stub(stripe.subscriptions,'list',async()=>({data:history}));
  stub(stripe.subscriptions,'retrieve',async()=>stripeSub);
  stub(stripe.subscriptions,'update',async(_id:any,data:any)=>{stripeSub={...stripeSub,...data};return stripeSub;});
  stub(stripe.paymentMethodConfigurations,'list',async()=>({data:[{id:'pmc_wallets',active:true,apple_pay:{display_preference:{value:'on'}},google_pay:{display_preference:{value:'on'}}}]}));
  stub(stripe.checkout.sessions,'list',async()=>({data:openSessions}));
  stub(stripe.checkout.sessions,'create',async(params:any)=>{created=params;creates++;return{id:'cs_trial_test',url:'https://checkout.stripe.com/c/pay/cs_trial_test'};});
  stub(stripe.checkout.sessions,'retrieve',async()=>({id:'cs_trial_test',mode:'subscription',status:'complete',metadata:{userId:'test-user',product:'premium_subscription'},subscription:'sub_trial_test'}));
  await new Promise<void>(resolve=>{server=createApp().listen(0,()=>{base='http://127.0.0.1:'+(server.address() as any).port;resolve();});});
});
after(async()=>{for(const restore of undo.reverse())restore();await new Promise<void>(resolve=>server.close(()=>resolve()));});
async function post(path:string,body:any,auth=true){return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+signAuthToken('test-user')}:{})},body:JSON.stringify(body)});}

test('checkout requires a card, grants seven days, discloses 3.99 recurring charge and uses enabled wallets',async()=>{
  current=null;history=[];openSessions=[];
  const response=await post('/billing/subscribe',{interval:'month',returnTo:'/?resumeAnalysis=1'});
  const result=await response.json() as any;
  assert.equal(response.status,201);assert.equal(result.sessionId,'cs_trial_test');assert.equal(result.trialDays,7);
  assert.equal(created.mode,'subscription');assert.equal(created.payment_method_collection,'always');assert.equal(created.payment_method_configuration,'pmc_wallets');
  assert.equal(created.subscription_data.trial_period_days,7);assert.equal(created.line_items[0].price_data.unit_amount,399);
  assert.equal(created.line_items[0].price_data.recurring.interval,'month');
  assert.match(created.custom_text.submit.message,/rinnovo automatico/);assert.match(created.success_url,/resumeAnalysis=1&subscription=success/);
});
test('an open checkout is reused and a returning subscriber does not receive another trial',async()=>{
  current={id:'db-sub',userId:'test-user',stripeCustomerId:'cus_trial_test',stripeSubscriptionId:'sub_previous',status:'CANCELLED'};
  history=[{status:'canceled'}];openSessions=[];
  assert.equal((await post('/billing/subscribe',{})).status,201);
  assert.equal(created.subscription_data.trial_period_days,undefined);
  openSessions=[{id:'cs_reuse',status:'open',mode:'subscription',metadata:{offer:'ai_7days_v2',returnTo:'/account'},url:'https://checkout.stripe.com/c/pay/cs_reuse'}];
  const beforeCount=creates;
  assert.equal((await post('/billing/subscribe',{})).status,200);assert.equal(creates,beforeCount);
  history=[{status:'trialing'}];assert.equal((await post('/billing/subscribe',{})).status,409);
  openSessions=[];history=[];
});
test('confirmation enables unlimited AI during the trial and does not record a revenue payment',async()=>{
  current=null;stripeSub=activeSub();
  const response=await post('/billing/confirm-subscription',{sessionId:'cs_trial_test'});
  assert.equal(response.status,200);assert.equal((await response.json() as any).trial,true);assert.equal(current.status,'TRIALING');
  assert.equal(subscriptionHasAccess(current),true);
  const entitlement=calculateAccountEntitlement({userId:'test-user',paidPurchases:0,analysisCount:500,premium:false,monthlyPremium:true,dailyAnalysisCount:500});
  assert.equal(entitlement.unlimited,true);assert.equal(entitlement.entitled,true);
  assert.equal([...events.values()].filter(e=>e.type==='purchase_completed').length,0);
  const report=await post('/reports/free-scan',{mode:'listing',make:'Fiat',model:'Panda',year:2019,km:75000});
  assert.equal(report.status,200);
});
test('expired trials and unpaid subscriptions cannot run AI, while model stays free',async()=>{
  current={status:'TRIALING',plan:'PREMIUM_MONTHLY',renewsAt:new Date(Date.now()-1000)};
  const input={make:'Fiat',model:'Panda',year:2019,km:75000};
  assert.equal((await post('/reports/free-scan',{...input,mode:'listing'})).status,402);
  assert.equal((await post('/reports/free-scan',{...input,mode:'model'},false)).status,200);
  current={status:'PAST_DUE',plan:'PREMIUM_MONTHLY',renewsAt:new Date(Date.now()+86400000)};
  assert.equal((await post('/reports/free-scan',{...input,mode:'listing'})).status,402);
  const png='data:image/png;base64,'+Buffer.from([137,80,78,71,13,10,26,10,0,0,0,0]).toString('base64');
  assert.equal((await post('/reports/free-scan',{imageData:png,recognitionOnly:true},false)).status,401);
  assert.equal((await post('/reports/photo-analyze',{imageData:png})).status,402);
});
test('cancel during the trial keeps access only until its stated end',async()=>{
  current=null;stripeSub=activeSub();await syncStripeSubscription(stripeSub,'test-user');
  assert.equal((await post('/billing/cancel-subscription',{})).status,200);assert.ok(current.cancelledAt);assert.equal(subscriptionHasAccess(current),true);
  assert.equal(subscriptionHasAccess(current,new Date(current.renewsAt.getTime()+1)),false);
});
test('signed subscription webhook activates and revokes access; invalid signatures are rejected',async()=>{
  current=null;stripeSub=activeSub();const stripe=getStripe();
  async function deliver(status:string){stripeSub={...stripeSub,status};const payload=JSON.stringify({id:'evt_unit_'+status,object:'event',type:'customer.subscription.updated',data:{object:stripeSub}});const signature=stripe.webhooks.generateTestHeaderString({payload,secret:'whsec_unit_only'});return fetch(base+'/billing/webhook',{method:'POST',headers:{'Content-Type':'application/json','Stripe-Signature':signature},body:payload});}
  assert.equal((await deliver('trialing')).status,200);assert.equal(current.status,'TRIALING');
  assert.equal((await deliver('active')).status,200);assert.equal(current.status,'ACTIVE');
  assert.equal((await deliver('canceled')).status,200);assert.equal(subscriptionHasAccess(current),false);
  assert.equal((await fetch(base+'/billing/webhook',{method:'POST',headers:{'Content-Type':'application/json','Stripe-Signature':'invalid'},body:'{}'})).status,400);
  await assert.rejects(syncStripeSubscription({...activeSub(),metadata:{userId:'another-user'}},'test-user'),/non associato/);
});
