'use strict';

const ifFoundByBinary = require('./libs/if-found-by-binary');
const hash37 = require('./libs/hash37');

function generateIfUncensorByHost(sortedHosts, indent) {

  const charToSet = {};
  const suffixToSubs = {};
  const ifNoSub = {};

  sortedHosts.forEach( function(host) {

    const lastTwoArr = host.split('.').slice(-2);
    const lastTwoStr = lastTwoArr.join('.');
    const i = hash37(lastTwoStr);
    charToSet[i] = charToSet[i] || [];
    charToSet[i].push(lastTwoStr);

  });

  //const toppy = Object.keys(suffixToSubs).sort((sufA, sufB) => suffixToSubs[sufA].length - suffixToSubs[sufB].length)[0];
  //console.error('Most popular suffix is ', toppy, ', it has', suffixToSubs[toppy].length, 'subdomains:', suffixToSubs[toppy]);

  const theArr = Object.keys(charToSet).sort().reduce((acc, i) => {

    acc[i] = JSON.stringify( charToSet[i].sort() );
    return acc;

  }, Array(37));

  return `function () {

    const lastTwoStr = host.split('.').slice(-2).join('.');

    const i = (${hash37.toString()})(lastTwoStr);
    return ifFoundByBinary(
        eval(${JSON.stringify(theArr)}[i]),
        lastTwoStr
      );
    /*
    if(
      !ifFoundByBinary(
        eval(${JSON.stringify(theArr)}[i]),
        lastTwoDoms
      )
    ) {
      return false;
    }
    const subdoms = ${JSON.stringify(suffixToSubs)}[lastTwoDoms];
    if (!subdoms) {
      return true;
    }
    if (!prefix) {
      return false;
    }
    return subdoms.some((sub) => prefix.endsWith(sub));
    */

  }()`;

};

function generateIfUncensorByIp(ips, indent) {

  function hash(ip) {

    return parseInt(ip.split('.')[3]);

  }

  const intToArr = {};
  let max = 255;
  while(max >= 0) {
    intToArr[max] = [];
    --max;
  }

  ips.forEach( function(ip) {

    const i = hash(ip);
    intToArr[i] = intToArr[i] || [];
    intToArr[i].push( ip );

  });

  const theArr = Object.keys(intToArr).sort().reduce((acc, i) => {

    acc[i] = JSON.stringify( intToArr[i].sort() );
    return acc;

  }, []);

  return `function () {

    return (ip && ifFoundByBinary( eval( ${JSON.stringify(theArr)}[(${hash.toString()})(ip)] ), ip));

  }()`;

}

module.exports = {
  mutateHostExpr: `
    if (/\\.(ru|co|cu|com|info|net|org|gov|edu|int|mil|biz|pp|ne|msk|spb|nnov|od|in|ho|cc|dn|i|tut|v|dp|sl|ddns|livejournal|herokuapp|azurewebsites)\\.[^.]+$/.test(host)) {
      host = host.replace(/(.+)\\.([^.]+\\.[^.]+\\.[^.]+$)/, '$2');
    } else {
      host = host.replace(/(.+)\\.([^.]+\\.[^.]+$)/, '$2');
    }
  `,
  requiredFunctions: [ifFoundByBinary, hash37],
  generate: {
    ifUncensorByHostExpr: generateIfUncensorByHost,
    ifUncensorByIpExpr: generateIfUncensorByIp,
  }
};
