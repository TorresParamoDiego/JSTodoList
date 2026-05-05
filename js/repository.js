
export default class Repository {
  constructor(baseUrl = 'http://localhost:3000/todos') {
    this.baseUrl = baseUrl;
  }

  async getAll() {
    try {
      const res = await fetch(this.baseUrl);
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  }

  async create(todo) {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      return await res.json();
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async update(id, todo) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
      return await res.json();
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
  async delete(id) {
    try {
      await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
}