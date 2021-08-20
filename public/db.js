var db;

const request = indexedDB.open('BudgetDB', 12);

request.onupgradeneeded = function (e) {
    const db = e.target.result;
    if (db.objectStoreNames.length === 0) {
      db.createObjectStore('BudgetStoreKC', { autoIncrement: true });
    }
};

request.onerror = function (e) {
  console.log(`Woops! there is something wrong`);
};

request.onsuccess = function (e) {
  db = e.target.result;
  console.log("inside onsuccess");
  if (navigator.onLine) {
    checkDB();
  }
};


const saveRecord = (record) => {
  const transaction = db.transaction(['BudgetStoreKC'], 'readwrite');
  const store = transaction.objectStore('BudgetStoreKC');
  store.add(record);
};

function checkDB() {
  console.log("inside CHECKDB");

  let transaction = db.transaction(['BudgetStoreKC'], 'readwrite');
  const store = transaction.objectStore('BudgetStoreKC');
  const getAllTransac = store.getAll()
  getAllTransac.onsuccess =  () => {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.length !== 0) {
            const t = db.transaction(['BudgetStoreKC'], 'readwrite');
            const storeCurrent = t.objectStore('BudgetStoreKC');
            storeCurrent.clear();
          }
        });
    }
  };
}


window.addEventListener('online', checkDatabase);