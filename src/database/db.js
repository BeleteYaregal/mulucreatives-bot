const fs = require('fs');
const path = require('path');
const { getStoragePath, initStorage } = require('../utils/storage');

class Database {
  constructor() {
    initStorage();
    this.dbPath = path.join(__dirname, '..', '..', 'storage', 'database.json');
    this.data = this._loadData();
  }

  _loadData() {
    if (fs.existsSync(this.dbPath)) {
      try {
        const fileContent = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading database file, starting fresh.', err);
      }
    }
    
    return {
      users: [],
      cards: [],
      orders: [],
      files: []
    };
  }

  _save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving database.', err);
    }
  }

  // User Methods
  saveUser(userData) {
    const existingIndex = this.data.users.findIndex(u => u.id === userData.id);
    const user = {
      ...userData,
      createdAt: userData.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.data.users[existingIndex] = { ...this.data.users[existingIndex], ...user };
    } else {
      this.data.users.push(user);
    }
    
    this._save();
    return user;
  }

  getUser(userId) {
    return this.data.users.find(u => u.id === userId) || null;
  }

  // Business Card Methods
  saveBusinessCard(cardData) {
    const existingIndex = this.data.cards.findIndex(c => c.id === cardData.id);
    const card = {
      ...cardData,
      createdAt: cardData.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.data.cards[existingIndex] = { ...this.data.cards[existingIndex], ...card };
    } else {
      this.data.cards.push(card);
    }
    
    this._save();
    return card;
  }

  getBusinessCard(cardId) {
    return this.data.cards.find(c => c.id === cardId) || null;
  }

  getUserCards(userId) {
    return this.data.cards.filter(c => c.userId === userId);
  }

  // Order Methods
  createOrder(orderData) {
    const existingIndex = this.data.orders.findIndex(o => o.id === orderData.id);
    const order = {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.data.orders[existingIndex] = { ...this.data.orders[existingIndex], ...order };
    } else {
      this.data.orders.push(order);
    }
    
    this._save();
    return order;
  }

  getOrder(orderId) {
    return this.data.orders.find(o => o.id === orderId) || null;
  }

  getUserOrders(userId) {
    return this.data.orders.filter(o => o.userId === userId);
  }

  getAllOrders() {
    return [...this.data.orders];
  }

  // File Methods
  saveGeneratedFile(fileData) {
    const existingIndex = this.data.files.findIndex(f => f.id === fileData.id);
    const file = {
      ...fileData,
      createdAt: fileData.createdAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      this.data.files[existingIndex] = { ...this.data.files[existingIndex], ...file };
    } else {
      this.data.files.push(file);
    }
    
    this._save();
    return file;
  }

  // Stats
  getStats() {
    return {
      totalUsers: this.data.users.length,
      totalCards: this.data.cards.length,
      totalOrders: this.data.orders.length
    };
  }
}

const db = new Database();
module.exports = db;
