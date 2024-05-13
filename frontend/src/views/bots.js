import viewBots from './bot';

export default (data) => (`
<div class="">
    <h1>Our bots</h1>
    ${data.map((bot) => viewBots(bot)).join('')}
    </div>
`);
