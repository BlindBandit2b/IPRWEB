import React, { useState } from "react";

class MedicalStaff {
  constructor(name, role) {
    this._name = name;
    this.role = role;
  }
  get name() { return this._name; }
  set name(newName) { this._name = newName; }

  getDutyInfo() { return `${this.name} (${this.role}) заступил на смену.`; }
}

class Specialist extends MedicalStaff {
  constructor(name, role, cabinet) {
    super(name, role);
    this.cabinet = cabinet;
  }
  provideConsultation(patient) {
    return `Специалист ${this.name} консультирует пациента: ${patient}`;
  }
}

function withLog(fn) {
  return function(...args) {
    console.log(`[LOG]: Вызвана функция с параметрами: ${JSON.stringify(args)}`);
    return fn.apply(this, args);
  };
}

export default function LabPage() {
  const [birthDate, setBirthDate] = useState("");
  const [matrix, setMatrix] = useState([]);
  const [size, setSize] = useState(3);
  const [profQuery, setProfQuery] = useState("");

  const checkAge = () => {
    if (!birthDate) return alert("Выберите дату");
    const bDate = new Date(birthDate);
    const age = new Date().getFullYear() - bDate.getFullYear();
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    if (age < 18) alert("ВНИМАНИЕ: Требуется разрешение родителей!");
    else alert(`Вам ${age} лет. День рождения: ${days[bDate.getDay()]}`);
  };


  const generate = () => {
    const s = parseInt(size);
    if (s > 15) return alert("Слишком большой размер");
    const m = Array.from({ length: s }, () =>
      Array.from({ length: s }, () => Math.floor(Math.random() * 100))
    );
    setMatrix(m);
  };

  const transpose = () => {
    if (matrix.length === 0) return;
    setMatrix(matrix[0].map((_, i) => matrix.map(row => row[i])));
  };

  const runOOPDemo = () => {
    const doc = new Specialist("Иванов И.И.", "Хирург", 405);
    const decoratedConsult = withLog(doc.provideConsultation.bind(doc));

    alert(`Объект создан: ${doc.getDutyInfo()}\nКабинет: ${doc.cabinet}`);
    console.log(decoratedConsult("Алексей"));
    alert("Результат работы декоратора выведен в консоль (F12)");
  };

  const [vacs] = useState([
    { prof: "Врач", salary: 4500, phone: "+375 29 111" },
    { prof: "Врач", salary: 2500, phone: "+375 29 222" },
    { prof: "Медсестра", salary: 1800, phone: "+375 29 333" },
    { prof: "Медсестра", salary: 1200, phone: "+375 29 444" }
  ]);

  const findBestJobs = () => {
    const filtered = vacs.filter(v => v.prof.toLowerCase() === profQuery.toLowerCase());
    if (filtered.length === 0) return alert("Профессия не найдена");
    const avg = filtered.reduce((acc, v) => acc + v.salary, 0) / filtered.length;
    const best = filtered.filter(v => v.salary > avg);
    alert(`Средняя ЗП для ${profQuery}: ${avg.toFixed(0)}\nНайдено выше среднего: ${best.map(b => b.phone).join(", ")}`);
  };

  return (
    <div className="profile-page-wrapper">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '25px', color: 'white' }}>
        <h2 className="gradienttext">Лабораторная работа №3 (JS)</h2>

        <section style={{ borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h3>1. Проверка возраста (п.7)</h3>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
                   style={{ padding: '8px', borderRadius: '8px', border: 'none' }} />
            <button onClick={checkAge} className="btn solid" style={{ margin: 0, height: '40px' }}>Проверить</button>
          </div>
        </section>

        <section style={{ borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h3>2. Работа с массивами (п.9)</h3>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input type="number" value={size} onChange={e => setSize(e.target.value)} style={{ width: '60px', padding: '8px', borderRadius: '8px' }} />
            <button onClick={generate} className="btn solid" style={{ margin: 0, height: '40px' }}>Создать</button>
            <button onClick={transpose} className="btn transparent" style={{ margin: 0, height: '40px' }}>Транспонировать</button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${size}, minmax(35px, 1fr))`,
            gap: '5px',
            marginTop: '15px',
            maxWidth: '400px'
          }}>
            {matrix.flat().map((n, i) => (
              <div key={i} onClick={(e) => e.target.style.background = n % 2 === 0 ? '#5995fd' : '#ff4b2b'}
                   style={{ border: '1px solid #777', textAlign: 'center', padding: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                {n}
              </div>
            ))}
          </div>
        </section>

        <section style={{ borderBottom: '1px solid #444', paddingBottom: '15px' }}>
          <h3>3. Классы и Наследование (п.10)</h3>
          <button onClick={runOOPDemo} className="btn solid" style={{ width: '250px' }}>Запустить демо ООП</button>
        </section>

        <section>
          <h3>4. Поиск вакансий (п.11 - вар. 25)</h3>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input placeholder="Профессия (Врач/Медсестра)" value={profQuery} onChange={e => setProfQuery(e.target.value)}
                   style={{ padding: '8px', borderRadius: '8px', border: 'none', flex: 1 }} />
            <button onClick={findBestJobs} className="btn solid" style={{ margin: 0, height: '40px' }}>Найти</button>
          </div>
        </section>
      </div>
    </div>
  );
}