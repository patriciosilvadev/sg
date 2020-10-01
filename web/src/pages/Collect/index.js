import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';
import { AiOutlineSearch } from 'react-icons/ai';
import CurrencyFormat from 'react-currency-format';
import CurrencyInput from 'react-currency-input-field';
import moment from 'moment';

import './style.css';
import api from '../../services/api';
import * as loadingActions from '../../store/actions/loading';
import * as toastActions from '../../store/actions/toast';
import * as callbackActions from '../../store/actions/callback';
import AppBar from '../../components/AppBar';
import myFormat from '../../helpers/myFormat';


function Client(props) {
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [registers, setRegisters] = useState([]);
    const [register, setRegister] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchField, setSearchField] = useState('');
    const [search, setSearch] = useState([]);
    const [selectFilterField, setSelectFilterField] = useState('client_document')

    //FIELDS
    const [client, setClient] = useState('');
    const [clientName, setClientName] = useState('');
    const [status, setStatus] = useState('Aberto');
    const [companie, setCompanie] = useState('');
    const [companieName, setCompanieName] = useState('');
    const [account, setAccount] = useState('');
    const [document, setDocument] = useState('');
    const [dtMaturity, setDtMaturity] = useState('');
    const [days, setDays] = useState('');
    const [value, setValue] = useState('');
    const [updatedDebt, setUpdatedDebt] = useState('');
    const [defaultHonorary, setDefaultHonorary] = useState(0);
    const [defaultInterest, setDefaultInterest] = useState(0);
    const [interestCalculed, setInterestCalculed] = useState(0);
    const [maximumDiscount, setMaximumDiscount] = useState(0);
    const [negotiatedValue, setNegotiatedValue] = useState(0);
    const [defaultPenalty, setDefaultPenalty] = useState(0);
    const [penaltyCalculed, setPenaltyCalculed] = useState(0);
    const [honoraryCalculed, setHonoraryCalculed] = useState(0);
    const [honoraryPer, setHonoraryPer] = useState(0);
    const [obs, setObs] = useState('');


    useEffect(() => {
        loadRegisters();
    }, []);

    const loadRegisters = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects')
            await setRegisters(res.data);
            await setSearch(res.data)
            await calculate()
            props.dispatch(loadingActions.setLoading(false));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleSubmit = async () => {
        props.dispatch(loadingActions.setLoading(true));
        calculate();

        //VALIDAÇÕES
        if (!client) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Preencha os campos obrigatórios!'));
            return 0
        }

        //CRIA OBJETO PARAR CADASTRAR/ALTERAR
        const regTemp = {
            client,
            status,
            document,
            dt_maturity: dtMaturity,
            value,
            account,
            days,
            companie,
            updated_debt: updatedDebt,
            maximum_discount: maximumDiscount,
            negotiated_value: negotiatedValue,
            honorary_per: honoraryPer,
            obs: obs
        }
        setRegister(regTemp);

        try {
            if (isUpdating) {
                //ALTERAÇÃO
                const res = await api.put(`collects/${register.id}`, regTemp)
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(toastActions.setToast(true, 'success', 'Registro alterado!'));
            } else {
                //CADASTRO
                const res = await api.post('collects', regTemp);
                setIsUpdating(false);
                setRegister({});
                clearValues();
                loadRegisters();
                props.dispatch(loadingActions.setLoading(false));
                props.dispatch(toastActions.setToast(true, 'success', 'Registro cadastrado!'));
            }
            setShow(false)
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }

    const handleDelete = async () => {
        props.dispatch(loadingActions.setLoading(true));
        try {
            const res = await api.delete(`collects/${register.id}`);
            setIsUpdating(false);
            setRegister({});
            clearValues();
            setShow(false);
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Registro deletado!'));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }


    const handleSearch = async () => {
        var tempSearch = [];
        if (selectFilterField === 'id')
            tempSearch = await registers.filter(find =>
                String(find.id).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_name')
            tempSearch = registers.filter(find =>
                String(find.client_name).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_document')
            tempSearch = registers.filter(find =>
                String(find.client_document).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)

        else if (selectFilterField === 'client_phones')
            tempSearch = registers.filter(find =>
                String(find.client_phone + find.client_cellphone).toLowerCase().indexOf(String(searchField).toLowerCase()) > -1)


        setSearch(tempSearch)
    }

    const setUpdating = async (reg) => {
        setRegister(reg);
        setClient(reg.client);
        setClientName(reg.client_name);
        setStatus(reg.status);
        setDays(reg.days);
        setCompanie(reg.companie)
        setCompanieName(reg.companie_name)
        setUpdatedDebt(reg.updated_debt)
        setDocument(reg.document)
        setDefaultInterest(reg.default_interest)
        setDefaultHonorary(reg.default_honorary)
        setAccount(reg.account)
        setDtMaturity(reg.dt_maturity)
        setMaximumDiscount(reg.maximum_discount)
        setNegotiatedValue(reg.negotiated_value)
        setHonoraryPer(reg.default_honorary);
        setDefaultPenalty(reg.default_penalty)
        setValue(reg.value);
        setObs(reg.obs)

        const res = await api.get(`companies/find-by-id/${reg.companie}`)
        if (res.data) {
            setCompanieName(res.data.name)
            setDefaultInterest(res.data.default_interest)
            setHonoraryPer(res.data.default_honorary)
            setDefaultPenalty(res.data.default_penalty)
        }
        await calculate();

        setIsUpdating(true);
        setShow(true)
    }

    const clearValues = () => {
        setClient('')
        setClientName('')
        setStatus('Aberto')
        setDocument('');
        setDtMaturity('');
        setAccount('');
        setCompanie('')
        setCompanieName('')
        setUpdatedDebt('')
        setDefaultHonorary('')
        setDefaultInterest('')
        setMaximumDiscount('')
        setNegotiatedValue('')
        setHonoraryPer('');
        setObs('')
        setDays('');
        setValue('');
        setDefaultPenalty('')
        loadRegisters();
    }

    const setNew = () => {
        setIsUpdating(false);
        clearValues();
        setShow(true);
    }


    const calculate = async () => {
        if (!moment(dtMaturity, "DD/MM/YYYY")._isValid)
            setDays(0)

        const calculedDays = await moment(dtMaturity, "DD/MM/YYYY").diff(moment(), 'days')

        if (calculedDays > -1)
            setDays(0)

        //DAYS
        setDays(calculedDays * -1)

        //INTEREST (JUROS)
        const interest = await (((myFormat.strValueToFloat(defaultInterest) / 100) * myFormat.strValueToFloat(value)) * myFormat.strValueToFloat(days));
        setInterestCalculed(interest);

        //PENALTY (MULTA)
        const penalty = await ((myFormat.strValueToFloat(defaultPenalty) / 100) * myFormat.strValueToFloat(value));
        setPenaltyCalculed(penalty);

        //HONORARY (HONORÁRIOS)
        const honorary = await ((myFormat.strValueToFloat(value) + myFormat.strValueToFloat(penalty) + myFormat.strValueToFloat(interest)) * (myFormat.strValueToFloat(honoraryPer) / 100))
        setHonoraryCalculed(honorary)

        const debit = await ((myFormat.strValueToFloat(interest) + myFormat.strValueToFloat(penalty) + myFormat.strValueToFloat(honorary) + myFormat.strValueToFloat(value)))
        setUpdatedDebt(debit)
    }

    const updateAllDebits = async () => {
        try {
            props.dispatch(loadingActions.setLoading(true));
            const res = await api.get('collects/recalc');
            await loadRegisters();
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Todos os débitos foram atualizados.'));
        } catch (error) {
            props.dispatch(loadingActions.setLoading(false));
            props.dispatch(toastActions.setToast(true, 'success', 'Houve um erro ' + error.message));
        }
    }


    return (
        <div className="collect-container">
            <AppBar />
            <div className="filters">
                <select
                    className="select-search"
                    onChange={e => setSelectFilterField(e.target.value)}>
                    <option value="id">Código</option>
                    <option value="client_name" selected> Nome do cliente</option>
                    <option value="client_document" > Documento do cliente</option>
                    <option value="client_phones" > Telefone do cliente</option>
                </select>
                <input
                    className="field-search"
                    value={searchField}
                    onChange={e => setSearchField(e.target.value)}
                    type="text"
                    onKeyPress={handleSearch} />
                <button onClick={updateAllDebits}> Atualizar todos os débitos </button>
            </div>

            <MDBTable responsive hover bordered>
                <MDBTableHead>
                    <tr>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Dt. Venc. </th>
                        <th>Vlr. Originário </th>
                        <th>Dias em Atraso</th>
                        <th>Débito Atualizado</th>
                        <th>Credor</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {search.map(reg => (
                        <tr
                            style={{ cursor: 'pointer' }}
                            onClick={async() => {await setUpdating(reg);calculate();}}
                            key={reg.id}>
                            <td>{reg.id}</td>
                            <td>{reg.client + ' - ' + reg.client_name}</td>
                            <td>{reg.status}</td>
                            <td>{reg.dt_maturity}</td>
                            <td>{reg.value ? reg.value.toLocaleString() : 0}</td>
                            <td>{reg.days}</td>
                            <td>{reg.updated_debt ? reg.updated_debt.toLocaleString() : 0}</td>
                            <td>{reg.companie + ' - ' + reg.companie_name}</td>
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            <Modal show={show} onHide={() => console.log('Cant close')}>
                <Modal.Header>
                    <Modal.Title>Cadastro de Débito</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        register.id ?
                            <div>
                                <label> Código </label>
                                <label> {': ' + register.id} </label>
                                <br />
                            </div>
                            : ''
                    }
                    <br />

                    <label> Credor </label>
                    <div className="inline">
                        <input
                            style={{ width: 80, marginRight: 5 }}
                            type="number"
                            placeholder="Cód."
                            value={companie}
                            onChange={async e => {
                                setCompanie(e.target.value)
                                if (!e.target.value) {
                                    setCompanieName('')
                                    setDefaultInterest('')
                                    setDefaultHonorary('')
                                    setDefaultPenalty('')
                                    setHonoraryPer('')
                                    return
                                }
                                const res = await api.get(`companies/find-by-id/${e.target.value}`)
                                if (res.data) {
                                    console.log(res.data)
                                    setCompanieName(res.data.name)
                                    setDefaultInterest(res.data.default_interest)
                                    setHonoraryPer(res.data.default_honorary)
                                    setDefaultPenalty(res.data.default_penalty)
                                }
                                else {
                                    setCompanieName('')
                                    setDefaultInterest('')
                                    setHonoraryPer('')
                                    setDefaultPenalty('')
                                }
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={companieName} />
                        <button
                            style={{ width: 'auto', marginLeft: 5, padding: 10 }}
                            onClick={() => props.dispatch(callbackActions.setCallback(true, 'companies', companie))}>
                            <AiOutlineSearch size="25" />
                        </button>
                        <br />
                    </div>

                    <label> Devedor </label>
                    <div className="inline">
                        <input
                            style={{ width: 80, marginRight: 5 }}
                            type="number"
                            placeholder="Cód."
                            value={client}
                            onBlur={calculate}
                            onChange={async e => {
                                setClient(e.target.value)
                                if (!e.target.value) {
                                    setClientName('')
                                    return
                                }
                                const res = await api.get(`clients/find-by-id/${e.target.value}`)
                                if (res.data)
                                    setClientName(res.data.name)
                                else
                                    setClientName('')
                            }} />
                        <input
                            type="text"
                            readOnly
                            value={clientName} />
                        <button
                            style={{ width: 'auto', marginLeft: 5, padding: 10 }}
                            onClick={() => props.dispatch(callbackActions.setCallback(true, 'clients', companie))}>
                            <AiOutlineSearch size="25" />
                        </button>
                        <br />
                    </div>

                    <div className="inline">
                        <div style={{ marginRight: 10 }}>
                            <label> Dt. Vencimento </label>
                            <CurrencyFormat
                                format="##/##/####"
                                placeholder="Data de vencimento"
                                value={dtMaturity ? dtMaturity : ''}
                                onValueChange={e => setDtMaturity(e.value)}
                                onBlur={calculate} />
                        </div>
                        <div>
                            <label> Dias em atraso </label>
                            <input
                                type="number"
                                placeholder="Dias"
                                value={days}
                                readOnly />
                        </div>
                    </div>

                    <label> Status </label>
                    <select
                        className="select-search"
                        onChange={e => setStatus(e.target.value)}>
                        <option value="Aberto" selected={status === 'Aberto' ? true : false}>Aberto</option>
                        <option value="Negociado" selected={status === 'Negociado' ? true : false}>Negociado</option>
                        <option value="Liquidado" selected={status === 'Liquidado' ? true : false}>Liquidado</option>
                    </select>

                    <label> Nota fiscal </label>
                    <input
                        type="text"
                        placeholder="Nota fiscal"
                        value={document}
                        onChange={e => setDocument(e.target.value)}
                        onBlur={calculate} />

                    <label> Modalidade de Faturamento </label>
                    <input
                        type="text"
                        placeholder="Conta"
                        value={account}
                        onChange={e => setAccount(e.target.value)}
                        onBlur={calculate} />


                    <label> R$ Valor Originário </label>
                    <CurrencyInput
                        prefix="R$ "
                        placeholder="Valor Originário"
                        decimalSeparator=","
                        groupSeparator="."
                        value={value ? value : ''}
                        onChange={e => setValue(e)}
                        onBlur={calculate} />

                    <label> R$ Multa </label>
                    <CurrencyInput
                        placeholder="Multa"
                        decimalSeparator=","
                        groupSeparator="."
                        value={penaltyCalculed ? penaltyCalculed : ''}
                        onChange={e => setPenaltyCalculed(e)}
                        readOnly />

                    <label> R$ Juros </label>
                    <CurrencyInput
                        placeholder="Juros"
                        decimalSeparator=","
                        groupSeparator="."
                        value={interestCalculed ? interestCalculed : ''}
                        onChange={e => setInterestCalculed(e)}
                        readOnly />

                    <div className="inline">
                        <div style={{ width: 200, marginRight: 5 }}>
                            <label> % Honorários </label>
                            <CurrencyInput
                                placeholder="Honorários"
                                decimalSeparator=","
                                groupSeparator="."
                                value={honoraryPer ? honoraryPer : ''}
                                onChange={e => setHonoraryPer(e)}
                                onBlur={calculate} />
                        </div>
                        <div>

                            <label> R$ Honorários </label>
                            <CurrencyInput
                                placeholder="Honorários "
                                decimalSeparator=","
                                groupSeparator="."
                                value={honoraryCalculed ? honoraryCalculed : ''}
                                onChange={e => setHonoraryCalculed(e)}
                                readOnly />
                        </div>

                    </div>

                    <label> R$ Débito Atualizado </label>
                    <div className="inline">
                        <CurrencyInput
                            placeholder="Débito Atualizado"
                            decimalSeparator=","
                            groupSeparator="."
                            value={updatedDebt ? updatedDebt : ''}
                            onChange={e => setUpdatedDebt(e)}
                            readOnly />
                        <button
                            style={{ marginLeft: 5, width: 'auto' }}
                            onClick={calculate}> Atualizar </button>
                    </div>
                    <label> R$ Desconto Máximo </label>
                    <CurrencyInput
                        placeholder="Desconto Máximo"
                        decimalSeparator=","
                        groupSeparator="."
                        value={maximumDiscount ? maximumDiscount : ''}
                        onChange={e => setMaximumDiscount(e)}
                        readOnly={isUpdating} />

                    <label> R$ Valor Negociado </label>
                    <CurrencyInput
                        placeholder="Valor Negociado"
                        decimalSeparator=","
                        groupSeparator="."
                        value={negotiatedValue}
                        onChange={e => setNegotiatedValue(e)}
                        readOnly
                        onBlur={() => {
                            if (parseFloat(negotiatedValue ? negotiatedValue : '0') < parseFloat(maximumDiscount ? maximumDiscount : '0')) {
                                setNegotiatedValue('')
                            }
                        }} />

                    <label> Observação </label>
                    <input
                        type="text"
                        placeholder="Observações"
                        value={obs}
                        onChange={e => setObs(e.target.value)} />

                </Modal.Body>
                <div className="modal-footer-container">
                    <button onClick={handleSubmit}> Salvar </button>
                    {isUpdating ? <button onClick={handleDelete} style={{ backgroundColor: '#ff6666' }} > Apagar </button> : <></>}
                    <button onClick={() => setShow(false)} style={{ backgroundColor: '#668cff' }} > Fechar </button>
                </div>
            </Modal>

            <div className="fab-container">
                <button onClick={() => setNew()}> + </button>
            </div>
        </div>
    );
}

export default connect(state => ({ state }))(Client);