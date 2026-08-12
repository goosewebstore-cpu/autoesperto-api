import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';

const router = Router();

const AskAssistantSchema = z.object({
  question: z.string().min(3, 'La domanda deve avere almeno 3 caratteri.').max(500, 'Domanda troppo lunga.'),
  vehicle: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().optional(),
    km: z.number().optional(),
  }).optional(),
  condition: z.object({
    dashboardLights: z.array(z.string()).optional(),
    accidentHistory: z.string().optional(),
    damages: z.array(z.string()).optional(),
  }).optional(),
});

router.post('/ask', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { question, vehicle, condition } = AskAssistantSchema.parse(req.body);
    const qLower = question.toLowerCase();

    let answer = '';
    const makeModel = [vehicle?.make, vehicle?.model].filter(Boolean).join(' ') || 'veicolo';

    if (qLower.includes('faro') || qLower.includes('luce') || qLower.includes('lampadina')) {
      answer = `Per i fari di una ${makeModel}, se il trasparente è opaco o ingiallito è possibile rimediare con un kit di lucidatura policarbonato (~15-25€). Se la parabola interna è crepata o rotta, si consiglia la sostituzione completa del gruppo ottico. I ricambi OEM o compatibili sono facilmente reperibili su eBay inserendo marca e modello.`;
    } else if (qLower.includes('meccanic') || qLower.includes('motore') || qLower.includes('spia') || qLower.includes('fumo') || qLower.includes('rumore')) {
      answer = `In caso di spie o anomalie meccaniche su ${makeModel}, è importante effettuare prima una diagnosi OBD2 in officina. Alcuni sensori (come sonda lambda o sensore ABS) si sostituiscono facilmente ed economico ordinando il ricambio online, mentre per parti interne del motore è fondamentale far intervenire un meccanico professionista per preservare la sicurezza.`;
    } else if (qLower.includes('vender') || qLower.includes('conviene') || qLower.includes('prezzo')) {
      answer = `Per decidere se conviene riparare o vendere la tua ${makeModel}: calcola il valore di mercato residuo (tenendo conto di anno e chilometri). Se la somma dei ricambi e riparazioni supera il 35-40% del valore attuale dell'auto, vendere l'auto nello stato di fatto può essere la scelta economicamente più conveniente.`;
    } else if (qLower.includes('ebay') || qLower.includes('ricamb') || qLower.includes('pezzi')) {
      answer = `Trovare ricambi per ${makeModel} su eBay è semplice: cerca sempre inserendo marca, modello, anno e il codice OEM del pezzo (stampato sul ricambio vecchio). Controlla il feedback del venditore e prediligi ricambi con compatibilità garantita.`;
    } else {
      answer = `Riguardo a "${question}" per la tua ${makeModel}: valuta lo stato generale di carrozzeria e meccanica. Per piccoli difetti estetici (graffi, specchietti, plastiche) i ricambi usati o compatibili su internet sono convenienti. Per spie di sicurezza (freni, airbag, spia motore) rivolgiti ad un'officina autorizzata.`;
    }

    return res.json({
      success: true,
      answer,
      vehicle: makeModel,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
