import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://autoesperto-api.onrender.com';

    const res = await fetch(`${apiUrl}/assistant/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const { question, vehicle } = body;
      const makeModel = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'veicolo';
      const qLower = (question || '').toLowerCase();

      let answer = '';
      if (qLower.includes('faro') || qLower.includes('luce') || qLower.includes('lampadina')) {
        answer = `Per i fari di ${makeModel}, se il trasparente è opaco o ingiallito puoi rigenerarlo con un kit di lucidatura policarbonato (~15-25€). Se la parabola o il supporto sono spezzati, sostituisci il gruppo ottico cercandolo su eBay con il codice OEM.`;
      } else if (qLower.includes('meccanic') || qLower.includes('motore') || qLower.includes('spia') || qLower.includes('rumore')) {
        answer = `Per problemi meccanici o spie del cruscotto su ${makeModel}, effettua prima una diagnosi OBD2 in officina. Componenti come sensori ABS, candele o filtri si acquistano comodamente online su eBay a prezzi contenuti.`;
      } else if (qLower.includes('colore') || qLower.includes('vernici') || qLower.includes('carrozzeria')) {
        answer = `Cambiare o ritoccare il colore della carrozzeria di ${makeModel}: per piccoli graffi usa uno stilo di ritocco con codice colore OEM dell'auto (~12-18€). Per verniciature trasversali o cambio colore completo, considera il wrapping con pellicola.`;
      } else {
        answer = `Per ${makeModel}: valuta lo stato di conservazione generale. I ricambi estetici usati o compatibili reperibili su eBay sono molto convenienti e facili da installare da soli o dal carrozziere di fiducia.`;
      }

      return NextResponse.json({ success: true, answer, vehicle: makeModel });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({
      success: true,
      answer: 'Consiglio dell\'Esperto AI: Per qualsiasi intervento di riparazione su questo veicolo, confronta i codici dei ricambi OEM su eBay e richiedi un preventivo scritto alla carrozzeria o all\'officina di fiducia.',
    });
  }
}
