// @flow

import fetchMock from 'fetch-mock';
import Smsc from '../Smsc';

jest.mock('../schema/db');

describe('Smsc', () => {
  const login = 'test_dev_kz';
  const password = 'test_dev_kz';
  const smsc = new Smsc({ login, password });

  beforeEach(() => {
    fetchMock.reset();
  });

  it('sendSms', async () => {
    const phones = '+77718637484';
    const message = 'hello';

    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=3`,
      response: { balance: '84.75', cnt: 1, cost: '0', id: 24 },
    });

    const res = await smsc.sendSms(phones, message);
    expect(res).toEqual({ balance: '84.75', cnt: 1, cost: '0', id: 24 });
  });

  it('getCost', async () => {
    const phones = '+77718637484';
    const message = 'hello';
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/send.php?login=${login}&psw=${password}&phones=${phones}&mes=${message}&fmt=3&cost=1`,
      response: { cnt: 1, cost: '0' },
    });

    const res = await smsc.getCost(phones, message);
    expect(res).toEqual({ cnt: 1, cost: '0' });
  });

  it('getStatus', async () => {
    const phone = '+77718637484';
    const id = 1;

    fetchMock.mock({
      matcher: `http://smsc.ru/sys/status.php?login=${login}&psw=${password}&phone=${phone}&id=${id}&fmt=3`,
      response: { last_date: '03.03.2018 15:47:14', last_timestamp: 1520070434, status: 1 },
    });

    const res = await smsc.getStatus(id, phone);
    expect(res).toEqual({
      last_date: '03.03.2018 15:47:14',
      last_timestamp: 1520070434,
      status: 1,
    });
  });

  it('getBalance', async () => {
    fetchMock.mock({
      matcher: `http://smsc.ru/sys/balance.php?login=${login}&psw=${password}&fmt=3`,
      response: { balance: '84.75' },
    });

    const res = await smsc.getBalance();
    expect(res).toEqual({ balance: '84.75' });
  });
});
