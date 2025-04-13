import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import products from '../flex/products.json' assert { type: 'json' };
import serviceAccount from '../flex/serviceAccountKey.json' assert { type: 'json' };

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

async function uploadProducts() {
    const batch = db.batch();
    const productsRef = db.collection('products');

    products.forEach(product => {
        const docRef = productsRef.doc(product.id); // ID продукта — ключ документа
        batch.set(docRef, {
            name: product.name,
            price: product.price,
            materials: product.materials
        });
    });

    await batch.commit();
    console.log('✅ Products uploaded successfully!');
}

uploadProducts().catch(console.error);

// node upload.js

