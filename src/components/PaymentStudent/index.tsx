/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import './styles.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row, Col, Form, Spinner } from 'react-bootstrap';
import SelectSearch from 'react-select-search';
import InputMask from 'react-input-mask';
import { Button } from '@material-ui/core';
import { ListPayment, Pagination } from '..';
import api from '../../services/api';
import { User } from '../../store/ducks/user/types';
import { Payment } from '../../services/types';
import {
  currencyMask,
  currencyConvert,
  formatDate,
  addZeroes,
} from '../../services/mask';
import { ReactComponent as TrashIcon } from '../../images/trash-icon.svg';

const PAYMENTS_PER_PAGE = 5;

const PaymentStudent: React.FC = () => {
  const { id } = useParams();
  const token = localStorage.getItem(
    String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
  );
  const [currentStudent, setCurrentStudent] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [payments, setPayment] = useState<Payment[]>();
  const [confirmPayment, setConfirmPayment] = useState<Payment>({
    id: 0,
    date: '',
    isPaid: false,
    payment_type: '',
    receipt_url: '' || undefined,
    updatedAt: '',
    user_id: 0,
    amount: 0,
  });
  const [onCharge, setOnCharge] = useState(true);
  // When use student charge [AR].
  // const [isSelectCharge, setIsSelectCharge] = useState(false);
  const [fileName, setFileName] = useState('');
  const [valueString, setValueString] = useState('');
  // When use student charge [AR].
  // const [chargingStudent, setChargingStudent] = useState({
  //   tolerance: 0,
  //   recurrence: [] as string[],
  // });

  // When use student charge [AR].
  // const weekDays = [
  //   { name: 'Segunda', value: '1' },
  //   { name: 'Terça', value: '2' },
  //   { name: 'Quarta', value: '3' },
  //   { name: 'Quinta', value: '4' },
  //   { name: 'Sexta', value: '5' },
  // ];

  const paymentType = [
    { value: 'creditcard', name: 'Cartão de crédito' },
    { value: 'billet', name: 'Boleto' },
    { value: 'transfer', name: 'Transferência bancária' },
    { value: 'cash', name: 'Dinheiro' },
  ];

  const getPaymentStudent = useCallback(() => {
    setLoading(true);
    api
      .get(`/users/search?id=${id}`, { headers: { Authorization: token } })
      .then(response => {
        setCurrentStudent(response.data.user);
        setPayment(response.data.payments);
        setLoading(false);
      })
      .catch(error => toast.error(`${error.response.data.message}`));
  }, [token, id]);

  useEffect(() => {
    getPaymentStudent();
  }, [id, getPaymentStudent]);

  const indexOfLastPayment = currentPage * PAYMENTS_PER_PAGE;
  const indexOfFirstPayment = indexOfLastPayment - PAYMENTS_PER_PAGE;
  const currentPayments =
    payments && payments.slice(indexOfFirstPayment, indexOfLastPayment);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const selectFile = (fileItem: FileList) => {
    if (fileItem[0] !== undefined) {
      const file = fileItem[0];

      if (file.size < 1e6 * 2) {
        setFileName(file.name);

        const bodyFormData = new FormData();

        bodyFormData.append('file', file);
        api
          .post('files/', bodyFormData, { headers: { Authorization: token } })
          .then(response => {
            setConfirmPayment({
              ...confirmPayment,
              receipt_url: response.data[0].url,
            });
            toast.success('Arquivo anexado com sucesso');
          })
          .catch(error => {
            toast.error('Erro ao anexar arquivo');
          });
      } else {
        toast.error('Selecione um arquivo até 2MB');
      }
    } else {
      setConfirmPayment({ ...confirmPayment, receipt_url: '' });
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (+currencyConvert(valueString) > 0) {
      if (
        confirmPayment.date !== '' &&
        confirmPayment.payment_type !== '' &&
        currentStudent
      ) {
        if (!confirmPayment.receipt_url) confirmPayment.receipt_url = undefined;
        const { date, payment_type, receipt_url } = confirmPayment;
        const payment_id = confirmPayment.id;
        const amount = +currencyConvert(valueString);

        api
          .post(
            `/users/confirm-payment/${currentStudent.id}`,
            { date, payment_type, receipt_url, amount, payment_id },
            {
              headers: { Authorization: token },
            },
          )
          .then(response => {
            toast.success('Pagamento realizado com sucesso');
            getPaymentStudent();
            setOnCharge(true);
            setFileName('');
            setConfirmPayment({
              ...confirmPayment,
              receipt_url: undefined,
            });
          })
          .catch(error => {
            toast.error(`${error.response.data.message}`);
          });
      } else {
        toast.error('Por favor, preencha todos campos');
      }
    } else {
      toast.error('O valor de pagamento não pode ser zero');
    }
  };

  const cancel = () => {
    setOnCharge(true);
    setFileName('');
    setConfirmPayment({
      ...confirmPayment,
      receipt_url: undefined,
    });
  };

  // When use student charge [AR].
  // const onSubmitCharge = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (
  //     currentStudent &&
  //     chargingStudent.tolerance > 0 &&
  //     chargingStudent.recurrence.length
  //   ) {
  //     api
  //       .put(`/users/${currentStudent.id}`, chargingStudent, {
  //         headers: { Authorization: token },
  //       })
  //       .then(response => {
  //         setChargingStudent({
  //           ...chargingStudent,
  //           recurrence: [],
  //           tolerance: 0,
  //         });
  //         setIsSelectCharge(false);
  //         toast.success('Cobrança configurada com sucesso');
  //       })
  //       .catch(error => toast.error(`${error.response.data.message}`));
  //   } else {
  //     toast.error('Preencha todos os campos');
  //   }
  // };

  return (
    <Col className="container-payment-student">
      {!loading ? (
        <>
          <Row>{currentStudent && <h4> {currentStudent.name} </h4>}</Row>
          {payments?.length ? (
            <>
              <Row className="container-table">
                {currentPayments && (
                  <ListPayment
                    payments={currentPayments}
                    confirmPayment={(event: Payment) => {
                      setConfirmPayment({
                        ...event,
                        date: formatDate(event.date),
                      });
                      setValueString(addZeroes(String(event.amount)) || '');
                      setOnCharge(false);
                    }}
                    // onCharge={() => // When use student charge [AR].
                    //   setOnCharge(true);
                    //   setIsSelectCharge(true);
                    // }}
                  />
                )}
              </Row>
              {payments && (
                <Pagination
                  paginate={paginate}
                  postsPerPage={PAYMENTS_PER_PAGE}
                  totalPosts={payments?.length}
                />
              )}
              {!onCharge ? (
                <>
                  <Row>
                    <h4>Confirmar Pagamento</h4>
                  </Row>
                  <Form
                    className="w-100"
                    onSubmit={(event: React.FormEvent) => onSubmit(event)}
                  >
                    <Row>
                      <Col className="pl-0">
                        <Form.Label>
                          {' '}
                          Data de Pagamento <span>*</span>{' '}
                        </Form.Label>
                        <Form.Control
                          className="form-white margin"
                          type="text"
                          as={InputMask}
                          mask="99/99/9999"
                          maskChar="_"
                          value={confirmPayment.date}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setConfirmPayment({
                              ...confirmPayment,
                              date: event.target.value,
                            });
                          }}
                        />
                        <Form.Label>
                          Valor <span>*</span>
                        </Form.Label>
                        <Form.Control
                          name="changeFor"
                          className="form-white changeFor"
                          value={currencyMask(valueString)}
                          required
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => setValueString(event.target.value)}
                        />
                      </Col>
                      <Col>
                        <Form.Label>
                          Tipo de Pagamento <span>*</span>
                        </Form.Label>
                        <SelectSearch
                          search
                          className="select-search margin"
                          placeholder=" "
                          options={paymentType}
                          value={confirmPayment.payment_type}
                          onChange={event => {
                            setConfirmPayment({
                              ...confirmPayment,
                              payment_type: String(event),
                            });
                          }}
                        />
                        <Form.Label> Anexar Comprovante </Form.Label>
                        <div>
                          <input
                            className="input-file"
                            type="file"
                            accept="image/png,image/jpg,image/jpeg,application/pdf"
                            id="contained-button-file"
                            disabled={fileName !== ''}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              selectFile(event.target.files || new FileList());
                            }}
                          />
                          <label
                            htmlFor="contained-button-file"
                            style={{ width: '100%' }}
                          >
                            <Button
                              variant="contained"
                              className="file-button"
                              component="span"
                            >
                              {fileName !== '' &&
                              confirmPayment.receipt_url !== '' ? (
                                <Row>
                                  {`${fileName}`}
                                  <Button
                                    className="ml-3 p-0"
                                    onClick={() => {
                                      setFileName('');
                                      setConfirmPayment({
                                        ...confirmPayment,
                                        receipt_url: '',
                                      });
                                    }}
                                  >
                                    <TrashIcon />
                                  </Button>
                                </Row>
                              ) : (
                                'Clique para anexar o comprovante'
                              )}
                            </Button>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <Row className="container-row-buttons">
                      <Button className="tertiary-button" onClick={cancel}>
                        Cancelar
                      </Button>
                      <Button className="secundary-button" type="submit">
                        Salvar
                      </Button>
                    </Row>
                  </Form>
                </>
              ) : (
                <>
                  {/* <Row> // When use student charge [AR].
                    <h4>Configurar Cobrança</h4>
                  </Row>
                  <Form
                    className="w-100"
                    onSubmit={(event: React.FormEvent) => onSubmitCharge(event)}
                  >
                    <Row>
                      <Col lg="6" className="pl-0">
                        <Form.Label>
                          {' '}
                          Início <span>*</span>{' '}
                        </Form.Label>
                        <Form.Control
                          type="number"
                          className="form-white"
                          value={chargingStudent.tolerance}
                          min={0}
                          max={31}
                          disabled={!isSelectCharge}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) =>
                            setChargingStudent({
                              ...chargingStudent,
                              tolerance: Number(event.target.value),
                            })
                          }
                        />
                        <Form.Text>
                          Selecione a quantidade de dias para começar a cobrança
                        </Form.Text>
                      </Col>
                    </Row>
                    <Row>
                      <Form.Label>
                        {' '}
                        Recorrência <span>*</span>{' '}
                      </Form.Label>
                    </Row>
                    <Row className="mp-2 mb-2">
                      {weekDays.map(day => (
                        <Form.Check
                          key={day.name}
                          id={day.name}
                          label={day.name}
                          disabled={!isSelectCharge}
                          checked={
                            chargingStudent.recurrence.filter(
                              item => item === day.value,
                            )[0] === day.value
                          }
                          onChange={() => {
                            if (
                              chargingStudent.recurrence.filter(
                                item => item === day.value,
                              )[0]
                            ) {
                              setChargingStudent({
                                ...chargingStudent,
                                recurrence: chargingStudent.recurrence.filter(
                                  (item: string) => item !== day.value,
                                ),
                              });
                            } else {
                              setChargingStudent({
                                ...chargingStudent,
                                recurrence: [
                                  ...(chargingStudent?.recurrence as any),
                                  day.value,
                                ],
                              });
                            }
                          }}
                        />
                      ))}
                    </Row>
                    <Row className="container-row-buttons mt-4">
                      <Button className="tertiary-button">Cancelar</Button>
                      <Button className="secundary-button" type="submit">
                        Salvar
                      </Button>
                    </Row>
                  </Form> */}
                </>
              )}
            </>
          ) : (
            <h5 className="mt-3 mb-3">Usuário não possui pagamentos</h5>
          )}
        </>
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
    </Col>
  );
};

export default PaymentStudent;
