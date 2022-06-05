import React, { useEffect, useState, useCallback } from 'react';
import './styles.scss';
import { Row, Col, Form } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import SelectSearch from 'react-select-search';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  IBGECityResponse,
  IGBEUFResponse,
  Options,
} from '../../services/types';
import { User } from '../../store/ducks/user/types';
import api from '../../services/api';
import { SavedUserModal } from '..';
import { currencyMask, currencyConvert, addZeroes } from '../../services/mask';

const FormStudent: React.FC = () => {
  const token = localStorage.getItem(
    String(process.env.REACT_APP_LOCAL_STORAGE_USER_AUTH),
  );
  const { id } = useParams();
  const [ufs, setUfs] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [showModalSuccess, handleShowModalSuccess] = useState(false);
  const [currentStudent, handleCurrentStudent] = useState<User>({
    name: '',
    email: '',
    user_type: 'student',
    phone: '',
    registration: '',
    birthDate: '',
    subjects: [],
    parent_name: '',
    note: '',
    monthly_cost: 0,
    parent_cpf: '',
    parent_whatsapp: '',
    paymentDay: '',
    address_zipcode: '',
    address_state: '',
    address_city: '',
    address_neighborhood: '',
    address_street: '',
    address_houseNumber: '',
    address_complement: '',
    gender: '',
    isActive: true,
    isCompliant: true,
    parent_gender: '',
    startDatePayment: '',
  });

  const gender = [
    { name: 'Feminino', value: 'female' },
    { name: 'Masculino', value: 'male' },
  ];

  const getStudentById = useCallback(
    (idParam: string) => {
      api
        .get(`users/search?id=${idParam}`, {
          headers: { Authorization: token },
        })
        .then(response => {
          handleCurrentStudent({
            ...response.data.user,
            monthly_cost: addZeroes(String(response.data.user.monthly_cost)),
          });
        })
        .catch(error => toast.error(`${error.response.data.message}`));
    },
    [token],
  );

  useEffect(() => {
    if (id) {
      getStudentById(id);
    }
  }, [id, getStudentById]);

  useEffect(() => {
    axios
      .get<IGBEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
      )
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (currentStudent.address_state === '') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${currentStudent.address_state}/municipios`,
      )
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [currentStudent.address_state]);

  const getUfsOptions = () => {
    const ufOptions: Options[] = [];
    ufs.map(uf =>
      ufOptions.push({
        value: uf,
        name: uf,
      }),
    );
    return ufOptions;
  };

  const getCitiesOptions = () => {
    const citiesOptions: Options[] = [];
    cities.map(city =>
      citiesOptions.push({
        value: city,
        name: city,
      }),
    );
    return citiesOptions;
  };

  const clearFields = () => {
    handleCurrentStudent({
      ...currentStudent,
      name: '',
      email: '',
      user_type: 'student',
      phone: '',
      registration: '',
      birthDate: '',
      subjects: [],
      parent_name: '',
      note: '',
      monthly_cost: 0,
      parent_cpf: '',
      parent_whatsapp: '',
      address_zipcode: '',
      address_state: '',
      address_city: '',
      address_neighborhood: '',
      address_street: '',
      address_houseNumber: '',
      address_complement: '',
      paymentDay: '',
      gender: '',
      isActive: true,
      isCompliant: true,
      parent_gender: '',
      startDatePayment: '',
    });
  };

  // const getDate = () => {
  //   const now = new Date();
  //   let nextDate;
  //   if (now.getMonth() + 1 > 11) {
  //     nextDate = new Date(
  //       `1/${currentStudent.paymentDay}/${now.getFullYear() + 1}`,
  //     );
  //   } else {
  //     nextDate = new Date(
  //       `${now.getMonth() + 2}/${
  //         currentStudent.paymentDay
  //       }/${now.getFullYear()}`,
  //     );
  //   }
  //   const diffTime = Math.abs((nextDate as any) - (now as any));
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //   if (diffDays >= 30) {
  //     return nextDate;
  //   }
  //   if (now.getMonth() + 2 > 11) {
  //     return new Date(
  //       `1/${currentStudent.paymentDay}/${now.getFullYear() + 1}`,
  //     );
  //   }
  //   return new Date(
  //     `${now.getMonth() + 3}/${currentStudent.paymentDay}/${now.getFullYear()}`,
  //   );
  // };

  const validateDate = () => {
    const newDate = currentStudent.startDatePayment?.split('/');
    const now = new Date();
    if (
      newDate &&
      ((Number(newDate[2]) >= now.getFullYear() &&
        Number(newDate[1]) > now.getMonth() + 1) ||
        (Number(newDate[1]) === now.getMonth() + 1 &&
          Number(newDate[0]) >= now.getDate()))
    ) {
      return true;
    }
    return false;
  };

  const getDate = () => {
    const newDate = currentStudent.startDatePayment?.split('/');
    return newDate ? new Date(`${newDate[1]}/${newDate[0]}/${newDate[2]}`) : '';
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      currentStudent.name !== '' &&
      currentStudent.email !== '' &&
      currentStudent.phone !== '' &&
      currentStudent.registration !== '' &&
      currentStudent.birthDate !== '' &&
      currentStudent.parent_name !== '' &&
      currentStudent.monthly_cost !== 0 &&
      currentStudent.parent_cpf !== '' &&
      currentStudent.parent_whatsapp !== '' &&
      currentStudent.address_zipcode !== '' &&
      currentStudent.address_state !== '' &&
      currentStudent.address_city !== '' &&
      currentStudent.address_neighborhood !== '' &&
      currentStudent.address_street !== '' &&
      currentStudent.address_houseNumber !== '' &&
      currentStudent.gender !== '' &&
      currentStudent.parent_gender !== '' &&
      currentStudent.startDatePayment !== ''
    ) {
      if (!id) {
        if (
          Number(currentStudent.paymentDay) > 0 &&
          Number(currentStudent.paymentDay) <= 31 &&
          getDate() !== ''
        ) {
          if (validateDate()) {
            api
              .post('/users/register', {
                ...currentStudent,
                monthly_cost: +currencyConvert(
                  String(currentStudent.monthly_cost),
                ),
                startDatePayment: getDate(),
              })
              .then(response => {
                handleShowModalSuccess(true);
                clearFields();
                const payment = {
                  user_id: response.data.user[0].id,
                  date: getDate(),
                  payment_type: 'creditcard',
                  amount: +currencyConvert(String(currentStudent.monthly_cost)),
                  isPaid: false,
                };
                api
                  .post('/payments', payment, {
                    headers: { Authorization: token },
                  })
                  .then(res => {
                    // console.log(res.data);
                  })
                  .catch(error => {
                    toast.error(
                      `Aluno criado com erro: ${error.response.data.message}`,
                    );
                  });
              })
              .catch(error => {
                toast.error(`${error.response.data.message}`);
              });
          } else {
            toast.error(
              'Por favor, preencha a data da primeira cobrança com uma data válida',
            );
          }
        } else {
          toast.error(
            'Por favor, preencha o dia de vencimento com um valor válido',
          );
        }
      } else {
        if (!currentStudent.paymentDay) currentStudent.paymentDay = undefined;
        if (!currentStudent.recurrence) currentStudent.recurrence = undefined;
        api
          .put(
            `/users/${id}`,
            {
              ...currentStudent,
              monthly_cost: +currencyConvert(
                String(currentStudent.monthly_cost),
              ),
              startDatePayment: !currentStudent.startDatePayment
                ? undefined
                : String(currentStudent.startDatePayment),
            },
            {
              headers: { Authorization: token },
            },
          )
          .then(response => {
            handleShowModalSuccess(true);
          })
          .catch(error => {
            toast.error(`${error.response.data.message}`);
          });
      }
    } else {
      toast.error('Por favor, preencha todos os campos obrigatórios');
    }
  };

  const cancelStudent = () => {
    if (id) {
      getStudentById(id);
    } else {
      clearFields();
    }
  };

  return (
    <div className="container-form-student">
      <Form onSubmit={(event: React.FormEvent) => onSubmit(event)}>
        <h5 className="mb-3">Dados do aluno</h5>
        <Row>
          <Col lg="6">
            <Form.Label>
              {' '}
              Nome Completo <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              id="fullname"
              className="form-white"
              type="name"
              value={currentStudent.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  name: event.target.value,
                })
              }
            />
          </Col>
          <Col lg="3">
            <Form.Label>
              {' '}
              Data de nascimento <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              id="birthDate"
              className="form-white"
              type="text"
              as={InputMask}
              mask="99/99/9999"
              maskChar="_"
              value={currentStudent.birthDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  birthDate: event.target.value,
                })
              }
            />
          </Col>
          <Col lg="3">
            <Form.Label>
              {' '}
              Sexo <span>*</span>{' '}
            </Form.Label>
            <SelectSearch
              id="gender"
              placeholder="Selecione"
              search
              options={gender}
              value={currentStudent.gender}
              className="select-search"
              onChange={event => {
                handleCurrentStudent({
                  ...currentStudent,
                  gender: String(event),
                });
              }}
            />
          </Col>
        </Row>
        <h5 className="mb-3">Dados do Responsável</h5>
        <Row>
          <Col lg="6">
            <Form.Label>
              {' '}
              Nome Completo <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              className="form-white"
              type="name"
              value={currentStudent.parent_name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  parent_name: event.target.value,
                })
              }
            />
            <Row>
              <Col>
                <Form.Label>
                  {' '}
                  E-mail <span>*</span>{' '}
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="email"
                  value={currentStudent.email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCurrentStudent({
                      ...currentStudent,
                      email: event.target.value,
                    })
                  }
                />
              </Col>
              <Col>
                <Form.Label>
                  Telefone <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="text"
                  as={InputMask}
                  mask="(99) 99999-9999"
                  maskChar="_"
                  value={currentStudent.phone}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCurrentStudent({
                      ...currentStudent,
                      phone: event.target.value,
                    })
                  }
                />
              </Col>
            </Row>
          </Col>
          <Col lg="3">
            <Form.Label>
              {' '}
              Sexo <span>*</span>{' '}
            </Form.Label>
            <SelectSearch
              search
              placeholder="Selecione"
              value={currentStudent.parent_gender}
              options={gender}
              className="select-search margin"
              onChange={event => {
                handleCurrentStudent({
                  ...currentStudent,
                  parent_gender: String(event),
                });
              }}
            />
            <Form.Label>
              WhatsApp <span>*</span>
            </Form.Label>
            <Form.Control
              className="form-white"
              type="text"
              as={InputMask}
              mask="(99) 99999-9999"
              maskChar="_"
              value={currentStudent.parent_whatsapp}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  parent_whatsapp: event.target.value,
                })
              }
            />
          </Col>
          <Col lg="3">
            <Form.Label>
              {' '}
              CPF <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              className="form-white"
              as={InputMask}
              mask="999.999.999-99"
              maskChar="_"
              value={currentStudent.parent_cpf}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  parent_cpf: event.target.value,
                })
              }
            />
          </Col>
        </Row>
        <h5 className="mb-3">Endereço</h5>
        <Row>
          <Col lg="6">
            <Form.Label>
              Logradouro <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              className="form-white"
              type="text"
              value={currentStudent.address_street}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  address_street: event.target.value,
                })
              }
            />
            <Form.Label> Complemento </Form.Label>
            <Form.Control
              className="form-white"
              type="text"
              value={currentStudent.address_complement}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  address_complement: event.target.value,
                })
              }
            />
          </Col>
          <Col lg="3">
            <Form.Label>
              Bairro <span>*</span>
            </Form.Label>
            <Form.Control
              className="form-white"
              type="text"
              value={currentStudent.address_neighborhood}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  address_neighborhood: event.target.value,
                })
              }
            />
            <Form.Label>
              Estado <span>*</span>
            </Form.Label>
            <SelectSearch
              value={currentStudent.address_state}
              placeholder="Selecione"
              search
              options={getUfsOptions()}
              onChange={event => {
                handleCurrentStudent({
                  ...currentStudent,
                  address_state: String(event),
                  address_city: '',
                });
              }}
            />
          </Col>
          <Col lg="3">
            <Row>
              <Col xl="5" lg="6">
                <Form.Label>
                  Número <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="number"
                  value={currentStudent.address_houseNumber}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCurrentStudent({
                      ...currentStudent,
                      address_houseNumber: event.target.value,
                    })
                  }
                />
              </Col>
              <Col xl="7" lg="6">
                <Form.Label>
                  CEP <span>*</span>
                </Form.Label>
                <Form.Control
                  className="form-white"
                  type="text"
                  as={InputMask}
                  mask="99999-999"
                  maskChar="_"
                  value={currentStudent.address_zipcode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCurrentStudent({
                      ...currentStudent,
                      address_zipcode: event.target.value,
                    })
                  }
                />
              </Col>
            </Row>
            <Form.Label>
              Cidade <span>*</span>
            </Form.Label>
            <SelectSearch
              value={currentStudent.address_city}
              placeholder="Selecione"
              search
              options={getCitiesOptions()}
              disabled={currentStudent.address_state === ''}
              onChange={event => {
                handleCurrentStudent({
                  ...currentStudent,
                  address_city: String(event),
                });
              }}
            />
          </Col>
        </Row>
        <h5 className="mb-3">Dados de Matrícula</h5>
        <Row>
          <Col lg="3">
            <Form.Label>
              Número da Matrícula <span>*</span>
            </Form.Label>
            <Form.Control
              className="form-white"
              type="number"
              min={1}
              value={currentStudent.registration}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  registration: event.target.value,
                })
              }
            />
          </Col>
          <Col lg="3">
            <Form.Label>
              {' '}
              Dia de Vencimento <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              className="form-white"
              type="number"
              min={1}
              max={31}
              value={currentStudent.paymentDay}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  paymentDay: event.target.value,
                })
              }
            />
          </Col>
          {!id && (
            <Col lg="3">
              <Form.Label>
                {' '}
                Data da Primeira Cobrança <span>*</span>{' '}
              </Form.Label>
              <Form.Control
                className="form-white"
                as={InputMask}
                mask="99/99/9999"
                maskChar="_"
                value={currentStudent.startDatePayment}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleCurrentStudent({
                    ...currentStudent,
                    startDatePayment: event.target.value,
                  })
                }
              />
            </Col>
          )}
          <Col lg="3">
            <Form.Label>
              {' '}
              Valor da mensalidade <span>*</span>{' '}
            </Form.Label>
            <Form.Control
              className="form-white"
              value={currencyMask(String(currentStudent.monthly_cost))}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  monthly_cost: event.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Form.Label>
              Matérias <span>*</span>{' '}
            </Form.Label>
            <Row className="container-subjects">
              <Col>
                <Form.Check
                  id="Português"
                  label="Português"
                  checked={
                    currentStudent.subjects?.filter(
                      subject => subject === 'portugues',
                    )[0] === 'portugues'
                  }
                  onChange={() => {
                    if (
                      currentStudent.subjects?.filter(
                        subject => subject === 'portugues',
                      )[0]
                    ) {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: currentStudent.subjects?.filter(
                          subject => subject !== 'portugues',
                        ),
                      });
                    } else {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: [
                          ...(currentStudent.subjects as string[]),
                          'portugues',
                        ],
                      });
                    }
                  }}
                />
              </Col>
              <Col>
                <Form.Check
                  id="Matemática"
                  label="Matemática"
                  checked={
                    currentStudent.subjects?.filter(
                      subject => subject === 'matematica',
                    )[0] === 'matematica'
                  }
                  onChange={() => {
                    if (
                      currentStudent.subjects?.filter(
                        subject => subject === 'matematica',
                      )[0]
                    ) {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: currentStudent.subjects?.filter(
                          subject => subject !== 'matematica',
                        ),
                      });
                    } else {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: [
                          ...(currentStudent.subjects as string[]),
                          'matematica',
                        ],
                      });
                    }
                  }}
                />
              </Col>
              <Col>
                <Form.Check
                  id="Inglês"
                  label="Inglês"
                  checked={
                    currentStudent.subjects?.filter(
                      subject => subject === 'ingles',
                    )[0] === 'ingles'
                  }
                  onChange={() => {
                    if (
                      currentStudent.subjects?.filter(
                        subject => subject === 'ingles',
                      )[0]
                    ) {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: currentStudent.subjects?.filter(
                          subject => subject !== 'ingles',
                        ),
                      });
                    } else {
                      handleCurrentStudent({
                        ...currentStudent,
                        subjects: [
                          ...(currentStudent.subjects as string[]),
                          'ingles',
                        ],
                      });
                    }
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg="9">
            <Form.Label>Observação</Form.Label>
            <Form.Control
              className="form-white"
              type="text"
              as="textarea"
              rows={3}
              value={currentStudent.note}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleCurrentStudent({
                  ...currentStudent,
                  note: event.target.value,
                })
              }
            />
          </Col>
        </Row>
        <Row noGutters className="container-row-buttons">
          <Button className="tertiary-button" onClick={cancelStudent}>
            Cancelar
          </Button>
          <Button className="secundary-button" type="submit">
            Salvar
          </Button>
        </Row>
      </Form>
      <SavedUserModal
        show={showModalSuccess}
        onHide={() => handleShowModalSuccess(false)}
      />
    </div>
  );
};

export default FormStudent;
