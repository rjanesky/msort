if (typeof Array.prototype.fsort === 'undefined') {
    Array.prototype.fsort = function (f) {
        return this.slice(0).sort(f.extract());
    };
}

var Sort = function (f) {
    return {
        extract: function () {
            return f;
        },

        reverse: function () {
            return Sort(function (x, y) {
                return f(y, x);
            });
        },

        concat: function (g) {
            return Sort(function (x, y) {
                return (f(x, y) !== 0) ? f(x, y) : g.extract()(x, y);
            });
        },

        contramap: function (g) {
            return Sort(function (x, y) {
                return f(g(x), g(y));
            });
        }
    };
};

Sort.empty = function () {
    return Sort(function (_,_) {
        return 0;
    });
};

Sort.concat = function (f) {
    return function (g) {
        return f.concat(g);
    };
};

Sort.byProp = function (h) {
    return Sort(function (x, y) {
        if (h(x) < h(y)) {
            return -1;
        } else if (h(x) > h(y)) {
            return 1;
        } else {
            return 0;
        }
    });
};