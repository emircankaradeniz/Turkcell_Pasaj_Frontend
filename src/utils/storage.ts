import localforage from "localforage";

// Sepet için özel storage
export const sepetStore = localforage.createInstance({
  name: "Pasaj",
  storeName: "sepet",
});

// Favoriler için özel storage
export const favoriStore = localforage.createInstance({
  name: "Pasaj",
  storeName: "favoriler",
});
