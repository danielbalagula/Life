module.exports = ({location, msg, param, value, nestedErrors}) => {
    return `${location}[${param}]: ${msg}`;
};