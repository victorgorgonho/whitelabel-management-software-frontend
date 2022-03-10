/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import './styles.scss';
import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Payment } from '../../services/types';
// When use student charge [AR].
// import { ReactComponent as ChargeIcon } from '../../images/charge-icon.svg';
import { ReactComponent as ConfirmPaymentIcon } from '../../images/confirm-payment-icon.svg';
import { ReactComponent as DownloadIcon } from '../../images/download-icon.svg';
import { formatDate } from '../../services/mask';

interface Props {
  payments: Payment[];
  confirmPayment(payment: Payment): any;
  // When use student charge [AR].
  // onCharge(): any;
}

const ListPayment: React.FC<Props> = (props: Props) => {
  // When use student charge [AR].
  // const { payments, confirmPayment, onCharge } = props;
  const { payments, confirmPayment } = props;

  return (
    <div className="container-list-payments">
      {payments.length && (
        <Table className="fade-in" responsive size="lg">
          <thead>
            <tr>
              <th>Valor</th>
              <th>Data de Vencimento</th>
              <th>Pagamento</th>
              <th>Data de Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr className="table-item" key={payment.id}>
                <td>
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(payment.amount || 0)}
                </td>
                <td> {formatDate(payment.date as string)} </td>
                <td className={payment.isPaid ? 'compliant' : 'defaulting'}>
                  {payment.isPaid ? 'Pago' : 'Pendente'}
                </td>
                <td>
                  {' '}
                  {payment.isPaid
                    ? `${formatDate(payment.updatedAt as string)}`
                    : 'Não Efetuado'}{' '}
                </td>
                <td className="container-buttons">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="download">Download do comprovante</Tooltip>
                    }
                  >
                    <a
                      className={
                        payment.receipt_url && payment.isPaid
                          ? 'download-icon'
                          : 'download-icon transparent'
                      }
                      href={`${payment.receipt_url}`}
                      target="blank"
                    >
                      <DownloadIcon />
                    </a>
                  </OverlayTrigger>
                  {/* <OverlayTrigger // When use student charge [AR].
                    overlay={<Tooltip id="charge">Cobrança</Tooltip>}
                  >
                    <a
                      className={
                        payment.isPaid ? 'charge-icon disable' : 'charge-icon'
                      }
                      onClick={onCharge}
                    >
                      <ChargeIcon />
                    </a>
                  </OverlayTrigger> */}
                  <OverlayTrigger
                    overlay={<Tooltip id="payment">Pagamento</Tooltip>}
                  >
                    <a
                      className={
                        payment.isPaid ? 'confirm-icon disable' : 'confirm-icon'
                      }
                      onClick={() => confirmPayment(payment)}
                    >
                      <ConfirmPaymentIcon />
                    </a>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ListPayment;
