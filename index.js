var cloudflare = require('cloudflare').createClient({
  email: process.env.CLOUDFLARE_EMAIL,
  token: process.env.CLOUDFLARE_TOKEN,
});
var request = require('request');


var url = '/glare';
var timeout = 3000;


/**
 * Check all CloudFlare domains, removing any records under each domain that
 * didn't pass the pre-defined health checks.
 **/
function checkDomains() {
  cloudflare.listDomains(function(err, domains) {
    if (err) {
      throw err;
    }

    domains.forEach(function(domain) {
      console.log('Checking domain:', domain.zone_name);
      checkRecords(domain);
    });
  });
}


/**
 * Check all CloudFlare records for the given domain, removing any records that
 * don't pass the pre-defined health checks.
 *
 * @param {object}      domain Domain object.
 **/
function checkRecords(domain) {
  cloudflare.listDomainRecords(domain.zone_name, function(err, records) {
    if (err || !records) {
      return;
    }

    records.forEach(function(record) {
      console.log('Checking record:', record.content, '(' + domain.zone_name + ')');
      checkRecord(record, function(err, record) {
        if (err) {
          removeRecord(domain, record);
        }
      });
    });
  });
}

/**
 * Check to see if a specific CloudFlare record is valid.  Valid records pass
 * the health check (and HTTP GET request to the predefined health check URL.
 *
 * @param {object}      record Record object.
 * @param {function}    callback A callback to run when the operation completes.
 *  The callback takes in two parameters, err and record.  If the health
 *  check passed, err will be null and record will contain a value --
 *  otherwise, status will be have a value and record will be null.
 **/
function checkRecord(record, callback) {
  var options = {
    url: 'https://' + record.content + url,
    timeout: timeout,
  };

  // Make an HTTPS request, first.
  request(options, function(err, resp, body) {
    if (!err && resp.statusCode >= 200 && resp.statusCode < 400) {
      return callback(null, record);
    } else {
      // Try an HTTP request next.
      options.url = 'http://' + record.content + url;
      request(options, function(err, resp, body) {
        if (!err && resp.statusCode >= 200 && resp.statusCode < 400) {
          return callback(null, record);
        } else {
          return callback(new Error('Health check failed for record: ' + record.content));
        }
      });
    }
  });
}


/**
 * Remove a CloudFlare domain record (thereby removing this server from the
 * pool).
 *
 * @param {object}      domain Domain object.
 * @param {object}      record Record object.
 * @param {function}    callback A callback to run when the operation completes.
 *  The callback takes in a single parameter, err.  If the operation was
 *  successful, err will be null.
 **/
function removeRecord(domain, record, callback) {
  cloudflare.deleteDomainRecord(domain.zone_name, record.rec_id, function(err, res) {
    if (callback && err) {
      return callback(err);
    }
    return callback();
  });
}


checkDomains();
