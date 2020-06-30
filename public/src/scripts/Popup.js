import {
  popupNew,
  formNew,
  popupEdit,
  popupAva,
  errorCollection,
  submitActiveFormNew,
  submitActiveFormEdit,
  submitActiveFormAva,
  titleNewInput,
  addLinkNewInput,
  userNameInput,
  userAboutInput,
  serverUrl,
  tokenApi,
  existingCard,
  avaLinkInput,
  formAva,
} from '../index';


import {
  Api
} from './Api';


export class Popup { // класс открытия, закрытия попапов
  constructor() {
      this.popupNew = document.querySelector('.popup');
      this.popupEdit = document.querySelector('.popup_edit');
      this.popupAva = document.querySelector('.popup_ava');
      this.popupButtonOpen = document.querySelector('.profile');
      this.open = this.open.bind(this);
      this.close = this.close.bind(this);
      this.validatorForm = this.validatorForm.bind(this);
      this.validTextInput = this.validTextInput.bind(this);
      this.validLinkInput = this.validLinkInput.bind(this);
      this.addInfo = this.addInfo.bind(this);
      this.addCard = this.addCard.bind(this);
      this.addAva = this.addAva.bind(this);
      this.handleEscClose = this.handleEscClose.bind(this);
      this.addListener();
  }

  open(e) {
      if (e.target.classList.contains('user-info__button_info')) {
          popupNew.classList.add('popup_is-opened');
          submitActiveFormNew();
      }

      if (e.target.classList.contains('user-info__button_edit-button')) {
          popupEdit.classList.add('popup_is-opened');
          submitActiveFormEdit();
      }

      if (e.target.classList.contains('user-info__photo')) {
          popupAva.classList.add('popup_is-opened');
          submitActiveFormAva();
      }

      document.addEventListener('keyup', this.handleEscClose);
  }

  close(e) {
      this.popupNew.classList.remove('popup_is-opened');
      this.popupEdit.classList.remove('popup_is-opened');
      this.popupAva.classList.remove('popup_is-opened');

      if (e.target.classList.contains('popup__close')) {
          popupNew.classList.remove('popup_is-opened');
      }

      if (e.target.classList.contains('popup__close_edit')) {
          popupEdit.classList.remove('popup_is-opened');
      }

      if (e.target.classList.contains('popup__close_ava')) {
          popupAva.classList.remove('popup_is-opened');
      }
  }

  handleEscClose(e) {
      if (e.keyCode === errorCollection.ESCAPE_CODE) {
          this.close();
      }
  }

  validatorForm(e) { // валидация формы
      const validator = e.target.name === 'link' ?
          this.validLinkInput :
          this.validTextInput;

      validator(e.target);
      submitActiveFormNew();
      submitActiveFormEdit();
      submitActiveFormAva();
  }

  validTextInput(textInput) { // валидация поля ввода "текст"
      let error = '';

      if (!textInput.checkValidity()) {
          if (textInput.validity.tooShort || textInput.validity.tooLong) {
              error = errorCollection.errorLength;
          }

          if (textInput.validity.valueMissing) {
              error = errorCollection.errorAlways;
          }
      }

      if (textInput.nextElementSibling !== null) {
          textInput.nextElementSibling.textContent = error;
      }
  }

  validLinkInput(linkInput) { // валидация поля ввода "ссылка"
      let error = '';

      if (!linkInput.checkValidity()) {
          if (linkInput.validity.valueMissing) {
              error = errorCollection.errorAlways;
          }

          if (linkInput.validity.typeMismatch) {
              error = errorCollection.errorLink;
          }
      }

      if (linkInput.nextElementSibling !== null) {
          linkInput.nextElementSibling.textContent = error;
      }
  }

  createInfo(nameUs, aboutUs) { // изменениe инфо о пользователе
      const userInfoName = document.querySelector('.user-info__name');
      const userInfoJob = document.querySelector('.user-info__job');

      const info = {

          name: nameUs,
          about: aboutUs,
      };

      const infoJson = JSON.stringify(info);

      const infoLoad = new Api(`${serverUrl}users/me`, tokenApi)
          .postInfo(infoJson)
          .then((res) => {
              console.log(res);
              const editButton = document.querySelector('.popup__button_edit');
              editButton.textContent = errorCollection.save;
              userInfoName.textContent = nameUs;
              userInfoJob.textContent = aboutUs;
          });
  }

  addInfo(e) { // функция добавления инфо о пользователе
      e.preventDefault();

      const editButton = document.querySelector('.popup__button_edit');
      editButton.textContent = errorCollection.load;
      const userInfo = document.querySelector('.user-info');

      this.createInfo(userNameInput.value, userAboutInput.value);

      popupEdit.classList.remove('popup_is-opened');
  }

  addCard(e) { // функция добавления новой карточки
      e.preventDefault();

      const addButton = document.querySelector('.popup__button');
      addButton.textContent = errorCollection.load;

      existingCard.addCard(titleNewInput.value, addLinkNewInput.value, []);

      formNew.reset();

      popupNew.classList.remove('popup_is-opened');
  }

  addAva(e) { // функция добавления новой карточки
      e.preventDefault();

      const addButton = document.querySelector('.popup__button_ava');
      addButton.textContent = errorCollection.load;
      const linkObj = {
          avatar: `${avaLinkInput.value}`,
      };

      const linkJson = JSON.stringify(linkObj);

      const loadAva = new Api(`${serverUrl}users/me/avatar`, tokenApi)
          .addAvatar(linkJson)
          .then((res) => {
              addButton.textContent = errorCollection.save;
              console.log(res);
          });

      formAva.reset();

      popupAva.classList.remove('popup_is-opened');
  }

  addListener() {
      this.popupButtonOpen
          .addEventListener('click', this.open); // открыть попап

      this.popupNew
          .querySelector('.popup__close')
          .addEventListener('click', this.close); // закрытие попапа "новое место"

      this.popupEdit
          .querySelector('.popup__close_edit')
          .addEventListener('click', this.close); // закрытие попапа "инфо о пользователе"

      this.popupAva
          .querySelector('.popup__close_ava')
          .addEventListener('click', this.close);

      this.popupEdit
          .querySelector('.popup__form_edit')
          .addEventListener('submit', this.addInfo);

      this.popupNew
          .querySelector('.popup__form')
          .addEventListener('submit', this.addCard);

      this.popupAva
          .querySelector('.popup__form_ava')
          .addEventListener('submit', this.addAva);

      this.popupNew
          .querySelector('.popup__form')
          .addEventListener('input', this.validatorForm); // валидация формы "новое место" при нажатии клавиши

      this.popupEdit
          .querySelector('.popup__form_edit')
          .addEventListener('input', this.validatorForm); // валидация формы "инфо о пользователе" при нажатии клавиши

      this.popupNew
          .querySelector('.popup__form')
          .addEventListener('click', this.validatorForm); // валидация поля "наименование" при клике

      this.popupEdit
          .querySelector('.popup__form_edit')
          .addEventListener('click', this.validatorForm); // валидация поля "ссылка" при клике

      this.popupAva
          .querySelector('.popup__form_ava')
          .addEventListener('input', this.validatorForm);

      this.popupAva
          .querySelector('.popup__form_ava')
          .addEventListener('click', this.validatorForm);
  }
}
