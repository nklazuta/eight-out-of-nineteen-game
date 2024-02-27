import './Field.css';

function Field({
  data, fieldNumber, selectedNumbers, onNumberClick,
}) {
  return (
    <div className="field">
      <p className="field__title">
        <span className="field__title_type_normal">
          Поле
          {' '}
          {fieldNumber}
        </span>
        Отметьте
        {' '}
        {data.quantity}
        {' '}
        {data.quantity === 1 ? 'число' : 'чисел'}
        .
      </p>
      <ul className="field__numbers-list">
        {data.arr.map((item) => (
          <li
            className="field__number-item"
            key={`array-${fieldNumber}-${item}`}
          >
            <button
              className={`field__number-btn ${
                selectedNumbers.includes(item)
                  ? 'field__number-btn_selected'
                  : ''
              }`}
              type="button"
              aria-label={
                selectedNumbers.includes(item)
                  ? 'Удалить число из выбранных'
                  : 'Выбрать число'
              }
              onClick={() => onNumberClick({ number: item, type: data.type })}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Field;
