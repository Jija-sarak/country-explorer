# Country Explorer Web Application

A responsive app for exploring countries worldwide. Fetches data from the REST Countries API, enabling search, filter, view details, and manage a favorites list.

---

## 🧩 Features

- **Country Cards**: Displays country flags and names.
- **Search**: Real-time search suggestions.
- **Filters**: Filter by region or language.
- **Pagination**: Load more countries dynamically.
- **Details Page**: Detailed info about a country.
- **Favorites**: Add up to 5 countries to a persistent favorites list.
- **Responsive Design**: Optimized for all screen sizes.

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/country-explorer.git
   ```
2. Navigate to the project folder:
   ```bash
   cd country-explorer
   ```
3. Open `index.html` in a browser.

---

## 📂 Project Structure

```
country-explorer/
├── index.html          
├── js/
  ├── app.js         
├── css/ 
  ├── details.css       
  ├── favorites.css         
  ├── style.css      
└── README.md           
```

---

## 📚 Key Functions

- `fetchCountries()`: Fetch country data from API.
- `renderCards()`: Display country cards.
- `renderDetails()`: Show detailed info for a country.
- `addToFavorites() / removeFromFavorites()`: Manage favorites.
- `filterData()`: Filter by region or language.
- `updateSuggestions()`: Real-time search updates.

---

## 🌐 API

- **REST Countries API**: Source of all country data.

---

## 📱 Responsive Design

Optimized for:
- **Large screens** (>1025px)
- **Medium screens** (787px-1025px)
- **Small screens** (426px-786px)
- **Extra small screens** (<426px)

---

## 🔧 Future Enhancements

- Add dark/light theme.
- Lazy load images for better performance.

---
