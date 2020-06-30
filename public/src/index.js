import './styles/style.css';
import {
    Api
} from './scripts/Api';
import {
    CardList
} from './scripts/CardList';
import {
    Card
} from './scripts/Card';
import {
    Popup
} from './scripts/Popup';

// переменные

export const serverUrl = NODE_ENV === 'development' ?
    'http://praktikum.tk/cohort4/' : 'https://praktikum.tk/cohort4/';
export const root = document.querySelector('.root');
export const placesList = root.querySelector('.places-list');
export const popupNew = root.querySelector('.popup');
export const popupEdit = root.querySelector('.popup_edit');
export const popupAva = root.querySelector('.popup_ava');

export const formNew = document.forms.new;
export const titleNewInput = formNew.elements.name;
export const addLinkNewInput = formNew.elements.link;
export const buttonNew = document.querySelector('.popup__button');
export const submitActiveFormNew = validButton.bind(formNew);

const formEdit = document.forms.edit;
export const userNameInput = formEdit.elements.nameuser;
export const userAboutInput = formEdit.elements.aboutuser;
const buttonEdit = document.querySelector('.popup__button_edit');
export const submitActiveFormEdit = validButton.bind(formEdit);

export const formAva = document.forms.ava;
export const submitActiveFormAva = validButton.bind(formAva);
export const avaLinkInput = formAva.elements.link;

export const tokenApi = 'e3c11277-8568-44d8-8899-1627e817d3a6';

export const errorCollection = { // коллекция ошибок валидации

    errorAlways: 'Это обязательное поле',
    errorLength: 'Должно быть от 2 до 30 символов',
    errorLink: 'Здесь должна быть ссылка',
    load: 'Загрузка...',
    save: 'Сохранить',
    plus: '+',
    remove: 'Вы действительно хотите удалить эту карточку?',
    ESCAPE_CODE: 27
};

const loadInfo = new Api(serverUrl + 'users/me', tokenApi). // загрузка инфо о пользователе с сервера
getInitialInfo()
    .then(info => {

        const userInfoName = document.querySelector('.user-info__name');
        const userInfoJob = document.querySelector('.user-info__job');

        document.querySelector('.user-info__photo').
        setAttribute('style', `background-image: url(${info.avatar})`);
        userInfoName.textContent = info.name;
        userInfoJob.textContent = info.about;
        userNameInput.value = info.name;
        userAboutInput.value = info.about;
        submitActiveFormEdit();
    })

export const existingCard = new CardList(placesList);

existingCard.render();

const open = new Popup();

function validButton() { // активация кнопки добавить или сохранить в попапе

    if (this.checkValidity()) {

        this.querySelector('[type=submit]').
        setAttribute('style', 'background-color: black; color: white;');
        this.querySelector('[type=submit]').disabled = !this.checkValidity();
    } else {

        this.querySelector('[type=submit]').
        removeAttribute('style', 'background-color: black; color: white;');
        this.querySelector('[type=submit]').disabled = !this.checkValidity();
    }
}