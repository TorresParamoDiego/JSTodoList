export default class Repository {
  constructor(storageKey = 'todos') {
    this.storageKey = storageKey;
    
  }

  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  saveAll(todos) {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }
  
}