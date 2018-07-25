import { db } from './firebase';

const settings = {timestampsInSnapshots: true};
db.settings(settings);

/* User Functions */
export const createUser = (id, name, email) => {
    return db.collection("users").doc(id).set({
        name,
        email,
        hours: 0,
    })
}
export const getUsers = () =>
    db.collection("users").get()
    .then(function(querySnapshot) {
        var users = [];
        querySnapshot.forEach(doc => {
            var {hours, name, email} = doc.data();
            users.push({
                id: doc.id,
                name,
                email,
                hours,
            });
        });
        return users;
    });

export const getUser = id =>
    db.collection("users").doc(id).get()
    .then(doc => {
        if (doc.exists) return doc.data();
        else return null;
    });

function updateHoursTransaction(transaction, userRef, amount) {
    return transaction.get(userRef)
    .then(function(userDoc) {
        if (!userDoc.exists) {
            throw Error("Document does not exist!");
        }

        var newHours = userDoc.data().hours + Number(amount);
        return transaction.update(userRef, { hours: newHours });
    })
}   
export const sendHoursToUser = (fromId, toId, amount) => {
    if (fromId === toId) return Promise.reject(Error('Trying to send to self.'))
    const fromUserRef = db.collection("users").doc(fromId);
    const toUserRef = db.collection("users").doc(toId);
    return db.runTransaction(async transaction => {
        const fromUserDoc = await transaction.get(fromUserRef);
        const toUserDoc = await transaction.get(toUserRef);
        if(!fromUserDoc.exists || !toUserDoc.exists) throw Error('Firebase error')
        const fromHours = fromUserDoc.data().hours - Number(amount);
        const toHours = toUserDoc.data().hours + Number(amount);
        await transaction.update(fromUserRef, {hours: fromHours});
        await transaction.update(toUserRef, {hours: toHours});
    })

};

export const logHours = (id, amount) => {
    const userRef = db.collection("users").doc(id);

    return db.runTransaction(transaction => updateHoursTransaction(transaction, userRef, amount))
};

/* Organisation functions*/
export const getOrganisations = () =>
    db.collection("organisations").get()
    .then(function(querySnapshot) {
        var orgs = [];
        querySnapshot.forEach(doc => {
            var {name, hoursGenerated} = doc.data();
            orgs.push({
                id: doc.id,
                name,
                hoursGenerated,
            });
        });
        return orgs;
    });

export const getOrganisation = id =>
    db.collection("organisations").doc(id).get()
    .then(doc => {
        if (doc.exists) return doc.data();
        else return null;
    });

function updateOrgsHoursGenerateTransaction(transaction, orgRef, amount) {
    return transaction.get(orgRef)
    .then((orgDoc) => {
        if (!orgDoc.exists) {
            throw Error("Document does not exist!");
        }

        var newHours = orgDoc.data().hoursGenerated + Number(amount);
        return transaction.update(orgRef, { hoursGenerated: newHours });
    })
}
export const updateDistributedHoursForOrg = (id, amount) => {
    const orgRef = db.collection("organisations").doc(id);
    return db.runTransaction(transaction => 
        updateOrgsHoursGenerateTransaction(transaction, orgRef, amount));
}

/* Transaction functions */
export const createTransaction = (type, from, fromName, to, toName, hours, description, dateCreated) => {
    console.log('Creating transaction');
    return db.collection("transactions").add({
        type,
        from,
        fromName,
        to,
        toName,
        hours,
        description,
        dateCreated,
    })
}
export const getTransactions = () =>
    db.collection("transactions").orderBy("dateCreated", "desc").get()
    .then(function(querySnapshot) {
        var transactions = [];
        querySnapshot.forEach(doc => {
            var {type, from, to, hours, description, fromName, toName, dateCreated} = doc.data();
            transactions.push({
                id: doc.id,
                type, from, fromName, to, toName, hours, description, dateCreated
            });
        });
        return transactions;
    });