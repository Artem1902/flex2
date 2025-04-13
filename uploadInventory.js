import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import inventory from './inventory.json' assert { type: 'json' };
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Инициализация Firebase Admin SDK
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function uploadInventory() {
    const batch = db.batch();
    const inventoryRef = db.collection('inventory');

    inventory.forEach(item => {
        const docRef = inventoryRef.doc(item.id); // Используем id как ключ документа
        batch.set(docRef, {
            name: item.name,
            quantity: item.quantity
        });
    });

    await batch.commit();
    console.log('✅ Inventory uploaded successfully!');
}

uploadInventory().catch(console.error);
