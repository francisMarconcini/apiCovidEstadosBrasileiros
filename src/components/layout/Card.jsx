import React,{Component} from 'react';
import { Bar } from 'react-chartjs-2';
const CACHE = {};
const url = "https://covid19-brazil-api.now.sh/api/report/v1";
var mortes = [];
var estado = [];
var casos = [];
var suspeitos = [];
var descartados = [];
var data = [];
export default class Card extends Component { 
    
    constructor(props) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          dadosM: {}
        };
      }

       getdataCovid(){
          fetch(url)
          .then(res => res.json())
          .then(
            async (result) => {
              console.log(result.data);  
              CACHE['covidEstados']=result.data;  
              this.setState({
                isLoaded: true,
                items: result.data,
                dadosM: await this.geraDataSetMortes(result.data)
              });
            },
            // Nota: É importante lidar com os erros aqui
            // em vez de um bloco catch() para não recebermos
            // exceções de erros dos componentes.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }

      returnArrayFromJson(items){
        items.map(item => (
            mortes.push(item.deaths),
            estado.push(item.uf),
            casos.push(items.cases),
            suspeitos.push(item.suspects),
            descartados.push(item.refuses),
            data.push(item.datetime)
            
        )
              )
        //console.log(estado);
        //console.log(mortes);
            }

      async getCache() {

        //Verifica os dados do cache primeiro
        if (CACHE['covidEstados'] != undefined) {
            this.setState({
                isLoaded: true,
                items: CACHE['covidEstados'],
                dadosM: await this.geraDataSetMortes(CACHE['covidEstados'])
              });
        }
        else{
            this.getdataCovid();
        }
      }

       geraDataSetMortes(items){
        this.returnArrayFromJson(items);  
        const dadosMortes = {
            labels: estado,
            datasets: [
              {
                label: 'Mortes por Estado brasileiro',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                hoverBorderColor: 'rgba(255,99,132,1)',
                data:mortes
              }
            ]
          };
          return dadosMortes;
      }

      componentDidMount() {
        this.getCache();
        //console.log(dadosMortes);
    
      }

render(){
    const { error, isLoaded, items,dadosM} = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
        console.log(dadosM);
return(
<div className="card" style={{width: "800rem",textAlign: "center"}}>
  <div>
  <Bar
          data={dadosM}
          width={800}
          height={500}
          options={{
            title:{
              display:true,
              text:'Mortes por Covid-19 - Brasil',
              fontSize:10
            },
            legend:{
              display:true,
              position:'right'
            },
            maintainAspectRatio: false
          }}
        />
  </div >
</div>
)
    }
}
}