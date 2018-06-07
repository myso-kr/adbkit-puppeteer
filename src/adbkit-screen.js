import _ from 'lodash';
import Promise from 'bluebird';

import ADB from 'adbkit';
import Client from 'adbkit/lib/adb/client';

Client.prototype.screen = async function(serial) {
  const PT_PHYSICAL_SIZE = /Physical size\: ([\d]+)x([\d]+)/ig;
  const PT_OVERRIDE_SIZE = /Override size\: ([\d]+)x([\d]+)/ig;
  const PT_PHYSICAL_DENSITY = /Physical density\: ([\d]+)/ig;
  const PT_OVERRIDE_DENSITY = /Override density\: ([\d]+)/ig;

  const s = (await this.shellWait(serial, 'wm size')).toString().trim();
  const d = (await this.shellWait(serial, 'wm density')).toString().trim();

  const MT_PHYSICAL_SIZE = PT_PHYSICAL_SIZE.exec(s);
  const MT_OVERRIDE_SIZE = PT_OVERRIDE_SIZE.exec(s);
  const MT_PHYSICAL_DENSITY = PT_PHYSICAL_DENSITY.exec(d);
  const MT_OVERRIDE_DENSITY = PT_OVERRIDE_DENSITY.exec(d);

  return {
    width : parseInt(_.nth(MT_OVERRIDE_SIZE, 1) || _.nth(MT_PHYSICAL_SIZE, 1)),
    height: parseInt(_.nth(MT_OVERRIDE_SIZE, 2) || _.nth(MT_PHYSICAL_SIZE, 2)),
    realWidth : parseInt(_.nth(MT_PHYSICAL_SIZE, 1)),
    realHeight: parseInt(_.nth(MT_PHYSICAL_SIZE, 2)),
    deviceScaleFactor: parseInt(_.nth(MT_OVERRIDE_DENSITY, 1) || _.nth(MT_PHYSICAL_DENSITY, 1)) / 160,
  };
}