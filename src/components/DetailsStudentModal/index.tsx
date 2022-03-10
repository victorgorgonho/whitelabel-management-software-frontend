/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import './styles.scss';
import { Modal, Row, Col, Form } from 'react-bootstrap';
import { User } from '../../store/ducks/user/types';

interface Props {
  show: boolean;
  onHide(): any;
  student: User;
}

const DetailsStudentModal: React.FC<Props> = (props: Props) => {
  const { student } = props;

  const sujects = [
    { value: 'portugues', name: 'Português' },
    { value: 'matematica', name: 'Matemática' },
    { value: 'ingles', name: 'Inglês' },
  ];

  return (
    <Modal {...props} centered size="xl" className="modal-details-student">
      <Modal.Header closeButton>
        <h4>Dados do Aluno</h4>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg="4">
            <Form.Label> Nome Completo </Form.Label>
            <p> {student.name} </p>
          </Col>
          <Col lg="4">
            <Form.Label> Data de Nascimento </Form.Label>
            <p> {student.birthDate} </p>
          </Col>
          <Col lg="4">
            <Form.Label> Sexo </Form.Label>
            <p> {student.gender === 'male' ? 'Masculino' : 'Feminino'} </p>
          </Col>
        </Row>
        <Row noGutters className="mb-4">
          <h4>Dados do Responsável</h4>
        </Row>
        <Row>
          <Col lg="3">
            <Form.Label> Nome Completo </Form.Label>
            <p> {student.parent_name} </p>
            <Form.Label> E-mail </Form.Label>
            <p> {student.email} </p>
          </Col>
          <Col lg="3">
            <Form.Label> Sexo </Form.Label>
            <p>
              {' '}
              {student.parent_gender === 'male' ? 'Masculino' : 'Feminino'}{' '}
            </p>
            <Form.Label> Telefone </Form.Label>
            <p> {student.phone} </p>
          </Col>
          <Col lg="3">
            <Form.Label> CPF </Form.Label>
            <p> {student.parent_cpf} </p>
            <Form.Label> WhatsApp </Form.Label>
            <p> {student.parent_whatsapp} </p>
          </Col>
        </Row>
        <Row noGutters className="mb-4">
          <h4>Endereço</h4>
        </Row>
        <Row className="mt-4 mb-2">
          <Col lg="3">
            <Form.Label> Logradouro </Form.Label>
            <p> {student.address_street} </p>
            {student.address_complement && (
              <>
                <Form.Label> Complemento </Form.Label>
                <p> {student.address_complement} </p>
              </>
            )}
          </Col>
          <Col lg="3">
            <Form.Label> Bairro </Form.Label>
            <p> {student.address_neighborhood} </p>
            <Form.Label> Estado </Form.Label>
            <p> {student.address_state} </p>
          </Col>
          <Col lg="3">
            <Form.Label> Número </Form.Label>
            <p> {student.address_houseNumber} </p>
            <Form.Label> Cidade </Form.Label>
            <p> {student.address_city} </p>
          </Col>
          <Col lg="3">
            <Form.Label> CEP </Form.Label>
            <p> {student.address_zipcode} </p>
          </Col>
        </Row>
        <Row noGutters className="mb-4">
          <h4>Dados da Matrícula</h4>
        </Row>
        <Row className="mt-4 mb-2">
          <Col lg="3">
            <Form.Label> Matrícula </Form.Label>
            <p> {student.registration} </p>
          </Col>
          <Col lg="3">
            <Form.Label> Dia de Vencimento </Form.Label>
            <p> {student.paymentDay} </p>
          </Col>
          <Col>
            <Form.Label> Matérias </Form.Label>
            <Row>
              {sujects.map(subject => (
                <Form.Check
                  key={subject.name}
                  id={subject.name}
                  label={subject.name}
                  checked={
                    student.subjects?.filter(
                      item => item === subject.value,
                    )[0] === subject.value
                  }
                  disabled
                />
              ))}
            </Row>
          </Col>
        </Row>
        {student.note !== '' && (
          <Row>
            <Col lg="6">
              <Form.Label> Obeservações </Form.Label>
              <p> {student.note} </p>
            </Col>
          </Row>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetailsStudentModal;
