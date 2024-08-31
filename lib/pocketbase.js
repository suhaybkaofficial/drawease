import PocketBase from 'pocketbase';

let pb;

function initPocketBase() {
  if (!pb) {
    pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
  }
  return pb;
}

export function getPocketBase() {
  return initPocketBase();
}

export function getFileUrl(record, filename) {
  const pb = initPocketBase();
  return pb.getFileUrl(record, filename);
}

export async function authWithOAuth2(provider) {
  const pb = initPocketBase();
  return await pb.collection('users').authWithOAuth2({ provider });
}

export async function getFullList(collection, options) {
  const pb = initPocketBase();
  return await pb.collection(collection).getFullList(options);
}

export async function create(collection, data) {
  const pb = initPocketBase();
  return await pb.collection(collection).create(data);
}

export async function update(collection, id, data) {
  const pb = initPocketBase();
  return await pb.collection(collection).update(id, data);
}

export async function deleteRecord(collection, id) {
  const pb = initPocketBase();
  return await pb.collection(collection).delete(id);
}

export const authStore = {
  get isValid() {
    const pb = initPocketBase();
    return pb.authStore.isValid;
  },
  get model() {
    const pb = initPocketBase();
    return pb.authStore.model;
  },
  get token() {
    const pb = initPocketBase();
    return pb.authStore.token;
  },
  clear() {
    const pb = initPocketBase();
    pb.authStore.clear();
  },
  save(token, model) {
    const pb = initPocketBase();
    pb.authStore.save(token, model);
  },
};