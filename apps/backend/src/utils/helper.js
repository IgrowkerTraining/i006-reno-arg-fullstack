class Helper {
    static transformKeysToSnakeCase = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(v => Helper.transformKeysToSnakeCase(v));
        } 
        if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
            return Object.keys(obj).reduce((result, key) => {
                const newKey = key
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[\s\.]+/g, '_'); 
                
                result[newKey] = Helper.transformKeysToSnakeCase(obj[key]);
                return result;
            }, {});
        }
        
        return obj;
    };
}

module.exports = Helper;

