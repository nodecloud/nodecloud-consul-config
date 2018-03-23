# nodecloud-consul-config

## Usage

```javascript
import ConsulConfig from 'nodecloud-consul-config';
import Consul from 'consul';

const consul = new Consul(/* ignore */);
const config = new ConsulCOnfig(consul, 'user-service', process.env.NODE_ENV, {format: 'yaml'});

config.get('user.name', 'zhangsan').then(name => {
    console.log(name);
});

config.watch('user.name', 'zhangsan', (err, name) => {
    console.log(name);
});
```