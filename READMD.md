# nodecloud-consul-config

## Usage

```javascript
import ConsulConfig from 'nodecloud-consul-config';
import Consul from 'consul';

const consul = new Consul(/* ignore */);
const config = new ConsulCOnfig(consul, {format: 'yaml'});

config.get('service-name', process.env.NODE_ENV).then(data => {
    console.log(data);
});

config.watch('service-name', process.env.NODE_ENV, (err, data) => {
    console.log(data);
});
```