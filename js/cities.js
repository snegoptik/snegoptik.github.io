/* Крупные центры, не полный справочник РФ.
   zone: "msk" — час на дату (летнее время, 2011–2014).
   Остальным — текущий пояс; на старых датах асцендент может сдвинуться ~на час.
   Не добавлять посёлки с «как сейчас в телефоне»: это выглядит точнее, чем есть. */
window.ZENIT_CITIES = [
  { name: "Москва", lat: 55.7558, lon: 37.6173, tz: 3, zone: "msk", aliases: ["Мск"] },
  { name: "Санкт-Петербург", lat: 59.9343, lon: 30.3351, tz: 3, zone: "msk", aliases: ["Питер", "Петербург", "СПб"] },
  { name: "Калининград", lat: 54.7104, lon: 20.4522, tz: 2 },

  { name: "Мурманск", lat: 68.9585, lon: 33.0827, tz: 3, zone: "msk" },
  { name: "Архангельск", lat: 64.5393, lon: 40.5187, tz: 3, zone: "msk" },
  { name: "Петрозаводск", lat: 61.7849, lon: 34.3469, tz: 3, zone: "msk" },
  { name: "Сыктывкар", lat: 61.6688, lon: 50.8352, tz: 3, zone: "msk" },
  { name: "Вологда", lat: 59.2181, lon: 39.8886, tz: 3, zone: "msk" },
  { name: "Череповец", lat: 59.1265, lon: 37.9092, tz: 3, zone: "msk" },
  { name: "Великий Новгород", lat: 58.5218, lon: 31.2755, tz: 3, zone: "msk", aliases: ["Новгород"] },
  { name: "Псков", lat: 57.8194, lon: 28.3318, tz: 3, zone: "msk" },
  { name: "Тверь", lat: 56.8587, lon: 35.9176, tz: 3, zone: "msk" },
  { name: "Ярославль", lat: 57.6266, lon: 39.8938, tz: 3, zone: "msk" },
  { name: "Кострома", lat: 57.7678, lon: 40.9269, tz: 3, zone: "msk" },
  { name: "Иваново", lat: 57.0004, lon: 40.9739, tz: 3, zone: "msk" },
  { name: "Владимир", lat: 56.1290, lon: 40.4066, tz: 3, zone: "msk" },
  { name: "Нижний Новгород", lat: 56.2965, lon: 43.9361, tz: 3, zone: "msk", aliases: ["Нижний"] },
  { name: "Киров", lat: 58.6035, lon: 49.6679, tz: 3, zone: "msk" },
  { name: "Чебоксары", lat: 56.1439, lon: 47.2489, tz: 3, zone: "msk" },
  { name: "Йошкар-Ола", lat: 56.6308, lon: 47.8861, tz: 3, zone: "msk" },
  { name: "Казань", lat: 55.7887, lon: 49.1221, tz: 3, zone: "msk" },
  { name: "Набережные Челны", lat: 55.7436, lon: 52.3958, tz: 3, zone: "msk", aliases: ["Челны"] },
  { name: "Саранск", lat: 54.1874, lon: 45.1839, tz: 3, zone: "msk" },
  { name: "Пенза", lat: 53.1950, lon: 45.0183, tz: 3, zone: "msk" },
  { name: "Рязань", lat: 54.6269, lon: 39.6916, tz: 3, zone: "msk" },
  { name: "Тула", lat: 54.1931, lon: 37.6173, tz: 3, zone: "msk" },
  { name: "Калуга", lat: 54.5138, lon: 36.2612, tz: 3, zone: "msk" },
  { name: "Смоленск", lat: 54.7826, lon: 32.0453, tz: 3, zone: "msk" },
  { name: "Брянск", lat: 53.2434, lon: 34.3637, tz: 3, zone: "msk" },
  { name: "Орёл", lat: 52.9703, lon: 36.0636, tz: 3, zone: "msk" },
  { name: "Курск", lat: 51.7373, lon: 36.1873, tz: 3, zone: "msk" },
  { name: "Белгород", lat: 50.5953, lon: 36.5872, tz: 3, zone: "msk" },
  { name: "Воронеж", lat: 51.6608, lon: 39.2003, tz: 3, zone: "msk" },
  { name: "Липецк", lat: 52.6088, lon: 39.5992, tz: 3, zone: "msk" },
  { name: "Тамбов", lat: 52.7212, lon: 41.4523, tz: 3, zone: "msk" },
  { name: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015, tz: 3, zone: "msk", aliases: ["Ростов"] },
  { name: "Таганрог", lat: 47.2364, lon: 38.8969, tz: 3, zone: "msk" },
  { name: "Краснодар", lat: 45.0355, lon: 38.9753, tz: 3, zone: "msk" },
  { name: "Сочи", lat: 43.5855, lon: 39.7231, tz: 3, zone: "msk" },
  { name: "Новороссийск", lat: 44.7235, lon: 37.7686, tz: 3, zone: "msk" },
  { name: "Ставрополь", lat: 45.0445, lon: 41.9690, tz: 3, zone: "msk" },
  { name: "Пятигорск", lat: 44.0498, lon: 43.0594, tz: 3, zone: "msk" },
  { name: "Махачкала", lat: 42.9849, lon: 47.5047, tz: 3, zone: "msk" },
  { name: "Грозный", lat: 43.3178, lon: 45.6949, tz: 3, zone: "msk" },
  { name: "Владикавказ", lat: 43.0257, lon: 44.6820, tz: 3, zone: "msk" },
  { name: "Нальчик", lat: 43.4853, lon: 43.6071, tz: 3, zone: "msk" },
  { name: "Черкесск", lat: 44.2269, lon: 42.0468, tz: 3, zone: "msk" },
  { name: "Майкоп", lat: 44.6071, lon: 40.1039, tz: 3, zone: "msk" },
  { name: "Элиста", lat: 46.3078, lon: 44.2558, tz: 3, zone: "msk" },
  { name: "Волгоград", lat: 48.7080, lon: 44.5133, tz: 3, zone: "msk" },
  { name: "Симферополь", lat: 44.9521, lon: 34.1024, tz: 3, zone: "msk" },
  { name: "Севастополь", lat: 44.6167, lon: 33.5254, tz: 3, zone: "msk" },

  { name: "Самара", lat: 53.1959, lon: 50.1002, tz: 4 },
  { name: "Тольятти", lat: 53.5303, lon: 49.3461, tz: 4 },
  { name: "Саратов", lat: 51.5336, lon: 46.0343, tz: 4 },
  { name: "Ульяновск", lat: 54.3142, lon: 48.4031, tz: 4 },
  { name: "Астрахань", lat: 46.3479, lon: 48.0336, tz: 4 },
  { name: "Ижевск", lat: 56.8526, lon: 53.2048, tz: 4 },

  { name: "Уфа", lat: 54.7388, lon: 55.9721, tz: 5 },
  { name: "Стерлитамак", lat: 53.6246, lon: 55.9502, tz: 5 },
  { name: "Оренбург", lat: 51.7682, lon: 55.0970, tz: 5 },
  { name: "Пермь", lat: 58.0105, lon: 56.2502, tz: 5 },
  { name: "Екатеринбург", lat: 56.8389, lon: 60.6057, tz: 5, aliases: ["Екб", "Свердловск"] },
  { name: "Нижний Тагил", lat: 57.9101, lon: 59.9813, tz: 5 },
  { name: "Челябинск", lat: 55.1644, lon: 61.4368, tz: 5 },
  { name: "Магнитогорск", lat: 53.4072, lon: 58.9791, tz: 5 },
  { name: "Курган", lat: 55.4444, lon: 65.3162, tz: 5 },
  { name: "Тюмень", lat: 57.1522, lon: 65.5272, tz: 5 },
  { name: "Сургут", lat: 61.2540, lon: 73.3960, tz: 5 },
  { name: "Нижневартовск", lat: 60.9397, lon: 76.5696, tz: 5 },

  { name: "Омск", lat: 54.9885, lon: 73.3242, tz: 6 },

  { name: "Новосибирск", lat: 55.0084, lon: 82.9357, tz: 7, aliases: ["Нск"] },
  { name: "Томск", lat: 56.4846, lon: 84.9476, tz: 7 },
  { name: "Кемерово", lat: 55.3541, lon: 86.0898, tz: 7 },
  { name: "Новокузнецк", lat: 53.7596, lon: 87.1216, tz: 7 },
  { name: "Барнаул", lat: 53.3468, lon: 83.7769, tz: 7 },
  { name: "Красноярск", lat: 56.0153, lon: 92.8932, tz: 7 },
  { name: "Абакан", lat: 53.7212, lon: 91.4423, tz: 7 },
  { name: "Кызыл", lat: 51.7191, lon: 94.4378, tz: 7 },
  { name: "Норильск", lat: 69.3558, lon: 88.1893, tz: 7 },

  { name: "Иркутск", lat: 52.2864, lon: 104.3050, tz: 8 },
  { name: "Братск", lat: 56.1514, lon: 101.6342, tz: 8 },
  { name: "Улан-Удэ", lat: 51.8335, lon: 107.5841, tz: 8 },

  { name: "Чита", lat: 52.0515, lon: 113.4711, tz: 9 },
  { name: "Якутск", lat: 62.0355, lon: 129.6755, tz: 9 },
  { name: "Благовещенск", lat: 50.2906, lon: 127.5272, tz: 9 },

  { name: "Хабаровск", lat: 48.4827, lon: 135.0840, tz: 10 },
  { name: "Комсомольск-на-Амуре", lat: 50.5496, lon: 137.0079, tz: 10 },
  { name: "Владивосток", lat: 43.1155, lon: 131.8855, tz: 10 },
  { name: "Уссурийск", lat: 43.7973, lon: 131.9520, tz: 10 },

  { name: "Южно-Сахалинск", lat: 46.9591, lon: 142.7380, tz: 11 },
  { name: "Магадан", lat: 59.5612, lon: 150.8090, tz: 11 },

  { name: "Петропавловск-Камчатский", lat: 53.0370, lon: 158.6559, tz: 12, aliases: ["Камчатка", "Петропавловск"] },
  { name: "Анадырь", lat: 64.7314, lon: 177.5089, tz: 12 },

  { name: "Минск", lat: 53.9006, lon: 27.5590, tz: 3, zone: "msk" },
  { name: "Киев", lat: 50.4501, lon: 30.5234, tz: 2 },
  { name: "Тбилиси", lat: 41.7151, lon: 44.8271, tz: 4 },
  { name: "Ереван", lat: 40.1792, lon: 44.4991, tz: 4 },
  { name: "Баку", lat: 40.4093, lon: 49.8671, tz: 4 },
  { name: "Алматы", lat: 43.2220, lon: 76.8512, tz: 5 },
  { name: "Ташкент", lat: 41.2995, lon: 69.2401, tz: 5 },
  { name: "Рига", lat: 56.9496, lon: 24.1052, tz: 2 },
  { name: "Вильнюс", lat: 54.6872, lon: 25.2797, tz: 2 },
  { name: "Таллин", lat: 59.4370, lon: 24.7536, tz: 2 },
  { name: "Прага", lat: 50.0755, lon: 14.4378, tz: 1 },
  { name: "Берлин", lat: 52.5200, lon: 13.4050, tz: 1 },
  { name: "Париж", lat: 48.8566, lon: 2.3522, tz: 1 },
  { name: "Лондон", lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: "Стамбул", lat: 41.0082, lon: 28.9784, tz: 3 },
  { name: "Тель-Авив", lat: 32.0853, lon: 34.7818, tz: 2 },
  { name: "Дубай", lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: "Нью-Йорк", lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: "Лос-Анджелес", lat: 34.0522, lon: -118.2437, tz: -8 }
];

function lastSundayUTC(year, monthIndex) {
  const d = new Date(Date.UTC(year, monthIndex + 1, 0));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().slice(0, 10);
}

function mskOffset(dateStr) {
  if (dateStr >= "2014-10-26") return 3;
  if (dateStr >= "2011-03-27") return 4;
  const y = Number(dateStr.slice(0, 4));
  if (y >= 1981 && dateStr < "2011-03-27") {
    const start = lastSundayUTC(y, 2);
    const end = lastSundayUTC(y, 9);
    if (dateStr >= start && dateStr < end) return 4;
    return 3;
  }
  return 3;
}

window.tzAt = function tzAt(city, dateStr) {
  if (!city) return 3;
  if (city.zone === "msk" && dateStr) return mskOffset(dateStr);
  return city.tz;
};

function cityKeys(c) {
  return [c.name].concat(c.aliases || []);
}

window.findCity = function findCity(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return window.ZENIT_CITIES[0];
  const list = window.ZENIT_CITIES;
  function hit(pred) {
    return list.find(function (c) {
      return cityKeys(c).some(function (k) { return pred(k.toLowerCase()); });
    });
  }
  return hit(function (k) { return k === q; })
    || hit(function (k) { return k.indexOf(q) === 0; })
    || (q.length >= 3 ? hit(function (k) { return k.indexOf(q) !== -1; }) : null)
    || null;
};
