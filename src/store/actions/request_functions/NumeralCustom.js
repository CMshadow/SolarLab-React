import Numeral from "numeral";

Numeral.register('locale', 'us', {
    delimiters: {
        thousands: ' ',
        decimal: '.'
    },
    abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    ordinal: function (number) {
        let b = number % 10;
        return (~~ (number % 100 / 10) === 1) ? 'th' :
            (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                    (b === 3) ? 'rd' : 'th';
    },
    currency: {
        symbol: '$'
    }
});

// switch between locales
Numeral.locale('us');

export default Numeral;
