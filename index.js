var cloudflare = require('cloudflare').createClient({
  email: process.env.CLOUDFLARE_EMAIL,
  token: process.env.CLOUDFLARE_TOKEN,
});
var request = require('request');


var url = '/glare';
var timeout = 3000;


cloudflare.listDomains(function(err, domains) {
  if (err) throw err;

  domains.forEach(function(domain) {
    console.log('Found domain:', domain.zone_name);
    listRecords(domain);
  });
});


function listRecords(domain) {
  cloudflare.listDomainRecords(domain.zone_name, function(err, records) {
    if (err) throw err;

    records.forEach(function(record) {
      checkRecord(record, function(record, status) {
        console.log('Found record:', record.content, '(', String(status), ')');

        if (status !== true) {
           cloudflare.deleteDomainRecord(domain.zone_name, record.rec_id, function(err, res) {
             if (err) throw err;
           });
        }

      });
    });
  });
}

function checkRecord(record, callback) {
  request({
    url: 'http://' + record.content + url,
    timeout: timeout,
  }, function(err, resp, body) {
    if (!err && resp.statusCode == 200) {
      return callback(record, true);
    } else {
      return callback(record, false);
    }
  });
}
