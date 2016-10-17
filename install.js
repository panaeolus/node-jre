/* MIT License
 *
 * Copyright (c) 2016 schreiben
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const os = require('os');
const fs = require('fs');
const path = require('path');
const rmdir = require('rmdir');
const zlib = require('zlib');
const tar = require('tar-fs');
const process = require('process');
const request = require('request');
const ProgressBar = require('progress');
const jre = require('.');

rmdir(jre.jreDir());

req = request
  .get({
    url: jre.url(),
    rejectUnauthorized: false,
    headers: {
      'Cookie': 'gpw_e24=http://www.oracle.com/; oraclelicense=accept-securebackup-cookie'
    }
  })
  .on('response', res => {
    var len = parseInt(res.headers['content-length'], 10);
    var bar = new ProgressBar('  downloading and preparing JRE [:bar] :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 80,
      total: len
    });
    res.on('data', chunk => bar.tick(chunk.length))
  })
  .on('error', err => console.log(`problem with request: ${err.message}`))
  .on('end', () => {
    console.log(jre.smoketest());
  })
  .pipe(zlib.createUnzip())
  .pipe(tar.extract(jre.jreDir()));
