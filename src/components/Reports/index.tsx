/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
import React, { useState, useEffect } from 'react';
import './styles.scss';
import { Bar } from 'react-chartjs-2';
import { Row, Spinner } from 'react-bootstrap';
import SelectSearch from 'react-select-search';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import api from '../../services/api';
import { Options } from '../../services/types';
import { ReactComponent as DownloadIcon } from '../../images/download-icon.svg';

const Reports: React.FC = () => {
  const token = localStorage.getItem(
    String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
  );
  const [chartData, setChartData] = useState({});
  const [selectYear, setSelectYear] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [infoGroup, setInfoGroup] = useState([
    { name: 'Adimplente', value: 0 },
    { name: 'Inadimplente', value: 0 },
    { name: 'Ativo', value: 0 },
    { name: 'Inativo', value: 0 },
  ]);
  const [dataCSV, setDataCSV] = useState([
    ['Mes', 'Adimplente', 'Inadimplente', 'Ativo', 'Inativo'],
  ]);

  const chart = (
    compliant: number[],
    defaulting: number[],
    actives: number[],
    inactives: number[],
  ) => {
    setChartData({
      labels: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
      ],
      datasets: [
        {
          label: 'Adimplente',
          data: compliant,
          backgroundColor: '#18B087',
        },
        {
          label: 'Inadimplente',
          data: defaulting,
          backgroundColor: '#FD6060',
        },
        {
          label: 'Ativo',
          data: actives,
          backgroundColor: '#3ECFF7',
        },
        {
          label: 'Inativo',
          data: inactives,
          backgroundColor: '#FDD660',
        },
      ],
    });
  };

  const getData = (year: string) => {
    setLoading(true);
    api
      .get(`reports?year=${year}`, { headers: { Authorization: token } })
      .then(response => {
        const compliantData: number[] = [];
        const defaultingData: number[] = [];
        const activesData: number[] = [];
        const inactivesData: number[] = [];
        const dataTable: any = [
          ['Mes', 'Adimplente', 'Inadimplente', 'Ativo', 'Inativo'],
        ];
        const monthNames = [
          'Janeiro',
          'Fevereiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro',
        ];

        response.data.map((month: any) => {
          const formattedDate = new Date(month.createdAt);
          const numberMonth = formattedDate.getMonth();

          compliantData[numberMonth] = month.compliants;
          defaultingData[numberMonth] = month.defaulting;
          activesData[numberMonth] = month.actives;
          inactivesData[numberMonth] = month.inactives;

          dataTable.push([
            monthNames[numberMonth],
            month.compliants,
            month.defaulting,
            month.actives,
            month.inactives,
          ]);
        });

        setDataCSV(dataTable);

        chart(compliantData, defaultingData, activesData, inactivesData);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Erro ao carregar dados');
        setLoading(false);
      });
  };

  useEffect(() => {
    const now = new Date();
    api
      .get(`reports?month=${now.getMonth()}&year=${now.getFullYear()}`, {
        headers: { Authorization: token },
      })
      .then(response => {
        const res = response.data;
        let previousMonth = {
          actives: 0,
          compliants: 0,
          inactives: 0,
          defaulting: 0,
        };
        if (res.length) {
          previousMonth = {
            actives: res[0].actives,
            compliants: res[0].compliants,
            inactives: res[0].inactives,
            defaulting: res[0].defaulting,
          };
        }

        api
          .get('/users', { headers: { Authorization: token } })
          .then(resp => {
            const { actives, compliants, defaulting, inactives } = resp.data;

            setInfoGroup([
              {
                name: 'Adimplente',
                value: compliants - previousMonth.compliants,
              },
              {
                name: 'Inadimplente',
                value: defaulting - previousMonth.defaulting,
              },
              { name: 'Ativo', value: actives - previousMonth.actives },
              { name: 'Inativo', value: inactives - previousMonth.inactives },
            ]);
          })
          .catch(() => {
            toast.error('Erro ao carregar dados do mês atual');
          });
      })
      .catch(() => {
        toast.error('Erro ao carregar dados do mês passado');
      });
  }, [token]);

  const getYears = () => {
    const now = new Date();
    const years: Options[] = [];

    for (let i = 0; i < 10; i++) {
      years.push({
        value: String(now.getFullYear() - i),
        name: String(now.getFullYear() - i),
      });
    }
    return years;
  };

  return (
    <div className="container-relatorios">
      <h5 className="mb-4">Dados do mês atual em relação ao mês anterior</h5>
      <Row noGutters className="container-info-group mb-4">
        {infoGroup.map(item => (
          <div
            key={item.name}
            className={`info-group ${item.name.toLowerCase()}`}
          >
            <h1>
              {' '}
              {item.value > 0 && '+'} {item.value}{' '}
            </h1>
            <div>
              Alunos <br />
              <b>{item.name}</b>
            </div>
          </div>
        ))}
      </Row>
      <div className="container-graph">
        <Row noGutters className="container-select">
          <SelectSearch
            placeholder="Selecione o ano"
            search
            className="select-search dark"
            options={getYears()}
            value={selectYear}
            onChange={event => {
              setSelectYear(String(event));
              getData(String(event));
            }}
          />
          <CSVLink
            data={dataCSV}
            className={
              selectYear !== '' ? 'download-button' : 'download-button disabled'
            }
            filename={`admin-relatorio-${selectYear}.csv`}
          >
            <DownloadIcon />
          </CSVLink>
        </Row>
        {!loading ? (
          <div>
            <Bar
              height={80}
              data={chartData}
              options={{
                responsive: true,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        beginAtZero: true,
                      },
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        ) : (
          <div className="container-loading">
            <Spinner
              as="span"
              animation="border"
              role="status"
              aria-hidden="true"
              className="spinner-blue"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
