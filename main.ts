import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { Deployment, Service, IntOrString } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const label = { app: 'hello-k8s', testLabel: 'test' };

    new Service(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, targetPort: IntOrString.fromNumber(8080) }],
        selector: label
      }
    });

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 1,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'hello-k8s',
                image: 'gcr.io/kuar-demo/kuard-amd64:blue',
                ports: [{ containerPort: 8080 }]
              }
            ]
          }
        }
      }
    });

  }
}

const app = new App();
new MyChart(app, 'pg-cdk8s');
app.synth();
