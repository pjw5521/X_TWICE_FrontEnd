import React, { useRef, useReducer, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, Form, Modal, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { setCookie, getCookie } from "../configs/cookie";
import { useUsers } from "../hooks/useUsers";
import { useKlaytn } from "../hooks/useKlaytn.js";
import Input from "./Input";

const ModalLogin: React.FC<any> = (props) => {
  const [success, setSuccess] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [privateKey, setPrivateKey] = useState(undefined);
  const pkHandler = () => {
    const decoded: any = jwt_decode(getCookie("myToken").toString());
    setPrivateKey(decoded.user_privatekey);
    //const pk = String(decoded.user_privatekey);
    //navigator.clipboard.writeText(String(decoded.user_privatekey));
    //document.execCommand("copy");
    copyToClipboard(String(decoded.user_privatekey))
      .then(() => console.log("text copied !"))
      .catch(() => console.log("error"));
    setSuccess(true);
  };
  function copyToClipboard(textToCopy: any) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        // here the magic happens
        document.execCommand("copy") ? res("fail") : rej();
        textArea.remove();
      });
    }
  }
  const { handleLogin, approve, getBalance } = useKlaytn();
  const [balance, setBalance] = useState("");
  useEffect(() => {
    getBalance().then(function (balance) {
      setBalance(balance);
    });
  }, [props.show]);
  const onClickHandler = () => {
    props.onHide();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          지갑 정보입니다. 하루에 한번 KLAY를 충전해주세요.
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2" controlId="formBasicPassword2">
          <Form.Label>프라이빗키</Form.Label>
          <Form.Control
            type="password"
            placeholder="프라이빗키"
            readOnly
            className="WalletInfo__address"
            name="address"
            value={"안녕프라이빗키는 안알려준단다."}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={pkHandler}>
          프라이빗키 복사
        </Button>
        {success ? <div style={{ color: "green" }}>Copy Success!</div> : null}
        <Form.Group className="mb-3 mt-4" controlId="formBasicPassword2">
          <Form.Label>보유 클레이</Form.Label>
          <Form.Control
            placeholder="Balance"
            className="WalletInfo__balance"
            name="balance"
            value={`${balance} KLAY`}
            readOnly
          />
        </Form.Group>

        <p className="WalletInfo__faucet">
          프라이빗키를 복사하고 링크를 통해 충전해주세요.
          <a
            className="WalletInfo__link"
            href="https://baobab.wallet.klaytn.com/access?next=faucet"
            target="_blank"
            rel="noreferrer noopener"
          >
            Run Klay Faucet
          </a>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClickHandler}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLogin;
