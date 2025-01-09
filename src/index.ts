import express, { Request, Response } from 'express';
import { db } from './firebase';
import cors from 'cors';
import crypto from 'crypto'
import { firestore } from 'firebase-admin';
import helmet from 'helmet'

const app = express();
const port = 3001;

//CORS Configuration 
const corsOptions = {
    origin: 'https://chatapp-d658c.web.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());




// RSA Private Key
const private_key = `
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`

// Decrypt
function decryptWithRSA(privateKey: string, encryptedText: string): string {
  const encryptedBuffer = Buffer.from(encryptedText, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, encryptedBuffer);
  return decrypted.toString('utf8');
}

// Sync Keys
app.post('/sync-keys', async (req: Request, res: Response): Promise<Response> => {
  const { nsec, npub } = req.body;

  if (!nsec || !npub) {
    return res.status(400).send('Missing nsec or npub');
  }

  try {
    const snapshot = await db.collection('user-management')
      .where('nsec', '==', nsec)
      .where('npub', '==', npub)
      .get();

    if (!snapshot.empty) {
      return res.status(400).send('Keys already synchronized.');
    }

    const newUserRef = db.collection('user-management').doc();
    await newUserRef.set({
      nsec: nsec,
      npub: npub,
      created_at: new Date(),
    });

    return res.status(200).send('Keys synchronized to DB');
  } catch (error) {
    console.error('Error in syncing keys: ', error);
    return res.status(500).send('Error in syncing keys');
  }
});


// Save Token
app.post('/token/save', async (req: Request, res: Response) => {
  const data = req.body;
  const decryptText = decryptWithRSA(private_key, data.qrCodeUrl);
  const urlParams = new URLSearchParams(decryptText.replace(/\n|\s/g, ""));

  const tk = urlParams.get("tk");
  const k = urlParams.get("k");
  const amt = urlParams.get("amt");
  const cn = urlParams.get("cn");
  const c_note_no = urlParams.get("c_note_no");
  const bn = urlParams.get("bn");
  const loc = urlParams.get("loc");
  const note = urlParams.get("note");

  const tokenData = {
    npriv: k,
    token: tk,
    amount: amt,
    enc_string: data.qrCodeUrl,
    status: '',
    currency_note: cn,
    currency_note_number: c_note_no,
    branch_name: bn,
    location: loc,
    notes: note,
    updated_at: '',
    created_at: firestore.Timestamp.fromDate(new Date()),
  };

  try {
    const docRef = db.collection('token_management').doc();
    await docRef.set(tokenData);

    res.status(200).json({
      message: 'Data received and saved successfully in Firestore',
      data: tokenData,
    });
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    res.status(500).json({ message: 'Failed to save data to Firestore', error });
  }
});

// Fetch tokens
app.get('/token/all', async (req: Request, res: Response) => {
  const npriv = req.query.npriv;

  try {
    const tokenCollection = db.collection('token_management');
    const nprivQuery = tokenCollection.where('npriv', '==', npriv);
    const snapshot = await nprivQuery.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No tokens found for the given npriv' });
    }
    const token = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const data = {
      status: 'success',
      tokens: token
    }
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    res.status(500).json({ message: 'Failed to fetch data from Firestore', error });
  }
});

// Delete token
app.delete('/token/delete/', async (req: Request, res: Response) => {
  const token = req.body.token;
  const key = req.body.key;

  try {
    const tokenCollection = db.collection('token_management');
    const nprivTokenQuery = tokenCollection
      .where('npriv', '==', key)
      .where('token', '==', token);
    const snapshot = await nprivTokenQuery.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No document found with the provided npriv and token' });
    }

    const docToDelete = snapshot.docs[0];
    await docToDelete.ref.delete();

    res.status(200).json({ message: 'Document successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document from Firestore', error });
  }
});

// Detail token
app.get('/token/detail', async (req: Request, res: Response) => {
  const token = req.query.token;

  try {
    const tokenCollection = db.collection('token_management');
    const nprivTokenQuery = tokenCollection
      .where('token', '==', token);
    const snapshot = await nprivTokenQuery.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No document found with the provided npriv and token' });
    }
    const tokenData = snapshot.docs[0].data();

    res.status(200).json({
      status: 'success',
      token: tokenData
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data from Firestore', error });
  }
});

// Sign token
app.post('/token/sign', async (req: Request, res: Response) => {
  const token = req.body.token;

  try {
    const tokenCollection = db.collection('token_management');
    const nprivTokenQuery = tokenCollection
      .where('token', '==', token);
    const snapshot = await nprivTokenQuery.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No document found with the provided npriv and token' });
    }
    const docToUpdate = snapshot.docs[0];
    await docToUpdate.ref.update({ status: 'Accepetd/Signed', updated_at: firestore.Timestamp.fromDate(new Date()) });

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update document in Firestore', error });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
