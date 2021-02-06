import { DireflowComponent } from 'direflow-component';
import { App } from './App';

App.defaultProps = {
  idToken: '',
}

export default DireflowComponent.create({
  component: App,
  configuration: {
    tagname: 'gestao-normas-webapp',
  },
  plugins: [
    {
      name: 'font-loader',
      options: {
        google: {
          families: ['Roboto Mono', 'Roboto'],
        },
        custom: {
          families: ['bootstrap-icons'],
          urls: ['https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css']
        }
      },
    },
    {
      name: 'external-loader',
      options: {
        paths: [
          'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css'
        ],
      }
    }
  ]
});
