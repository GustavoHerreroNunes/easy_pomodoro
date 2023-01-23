const databaseInfo = {
    name: "easy_pomodoro",
    version: 1,
    objectStore: {
        name: "timers", 
        keyPath: "name", 
        autoIncrement: false,
        data:[
            {name: "Pomodoro", time: "25:00", frequency: null},
            {name: "Pausa Curta", time: "5:00", frequency: 1},
            {name: "Pausa Longa", time: "15:00", frequency: 4},
        ]
    },
}

const openDatabase = (onSuccess) => {
    const openRequest = indexedDB.open(databaseInfo.name, databaseInfo.version);

    openRequest.onupgradeneeded = indexedDBController.onUpgradeNeeded;

    openRequest.onerror = (event) => {
        const error = event.target.error;
        console.log(`Error occured when initializating the database: ${error}`);
    }

    openRequest.onsuccess = (event) => {
        const db = event.target.result;

        console.log("Database opened");
        console.log(db);

        onSuccess(db);
    };
}

const onUpgradeNeeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore(
        databaseInfo.objectStore.name,
        {keyPath: databaseInfo.objectStore.keyPath},
        {autoIncrement: databaseInfo.objectStore.autoIncrement}
    );

    objectStore.createIndex("time", "time", {unique: false});
    objectStore.createIndex("frequency", "frequency", {unique: false});

    objectStore.transaction.oncomplete = () => {
        const timers = db.transaction(databaseInfo.objectStore.name, "readwrite").objectStore(databaseInfo.objectStore.name);

        const timersRegistries = databaseInfo.objectStore.data;

        timersRegistries.forEach((registry) => {
            timers.add(registry);
        });

        console.log("Object Store Created");
    }
}

const getAllRegistries = (db, onSuccess) => {
    const objectStore = db.transaction(databaseInfo.objectStore.name, "readonly").objectStore(databaseInfo.objectStore.name);
    
    const getRequest = objectStore.getAll();

    getRequest.onsuccess = (event) => {
        const registries = event.target.result;

        console.log(registries);

        (onSuccess) && (onSuccess(registries));
    }
}

const getRegistry = (db, name, onSuccess) => {
    const objectStore = db.transaction(databaseInfo.objectStore.name, "readonly").objectStore(databaseInfo.objectStore.name);
    
    const getRequest = objectStore.get(name);

    getRequest.onsuccess = (event) => {
        const registry = event.target.result;

        console.log(registry);

        (onSuccess) && (onSuccess(registry));
    }
}

const updateRegistry = (db, newRegistry, onSuccess) => {
    const objectStore = db.transaction(databaseInfo.objectStore.name, "readwrite").objectStore(databaseInfo.objectStore.name);

    const updateRequest = objectStore.put(newRegistry);

    updateRequest.onsuccess = (event) => {
        console.log(`Registry "${newRegistry.name}" updated`);

        (onSuccess) && (onSuccess(event));
    }
}

const indexedDBController = { openDatabase, onUpgradeNeeded, getAllRegistries, getRegistry, updateRegistry };

export default indexedDBController;
