export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'DEALER' | 'ADMIN';
  plan: string;
  credits: number;
}
