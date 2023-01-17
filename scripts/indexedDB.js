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

const openDatabase = () => {
    return indexedDB.open(databaseInfo.name, databaseInfo.version);
}

const onUpgradeNeeded = (event) => {
    const db = event.target.result;

    const objectStore = db.createObjectStore(
        databaseInfo.objectStore.name,
        {keyPath: databaseInfo.objectStore.keyPath},
        {autoIncrement: databaseInfo.objectStore.autoIncrement}
    );

    objectStore.createIndex("time", {unique: false});
    objectStore.createIndex("frequency", {unique: false});

    objectStore.transaction.oncomplete = () => {
        const timers = objectStore.transaction(databaseInfo.objectStore.name, "readwrite").objectStore(databaseInfo.objectStore.name);

        const timersRegistries = databaseInfo.objectStore.data;

        timersRegistries.forEach((registry) => {
            timers.add(registry);
        });

        console.log("Object Store Created");
    }
}

const getRegistries = (db, onSuccess) => {
    const objectStore = db.transaction(databaseInfo.objectStore.name, "readonly").objectStore(databaseInfo.objectStore.name);
    
    const getRequest = objectStore.getAll();

    getRequest.onsuccess = (event) => {
        const registries = event.target.result;

        console.log(registries);

        (onSuccess) && (onSuccess(event));
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
