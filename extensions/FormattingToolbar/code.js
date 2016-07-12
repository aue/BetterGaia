class FormattingToolbar extends Extension {
  constructor() {
    super('FormattingToolbar');
    this.match = ['/mygaia/'];
  }

  static info() {
    return {
      id: 'FormattingToolbar',
      title: 'Formatting Toolbar',
      description: 'Be unconfused when typing things out.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  static defaultPrefs() {
    return {};
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    function toolbar() {
      $("body #editor #format_controls .format-text").append(`<li>
        <a class="bg_addemoji" onclick="var el = document.getElementById('emoticons'); el.style.display = (el.style.display != 'block' ? 'block' : ''); var el2 = document.getElementById('emote_select'); el2.style.display = (el2.style.display != 'block' ? 'block' : '');" title="Add Emoji">Add Emoji</a>
      </li>`);

      // Add spoiler button
      $("body #editor #format_controls .format-elements").append("<li><a class='bg_spoiler' onclick='function wrapText(elementID, openTag, closeTag) {var textarea = document.getElementById(elementID); var len = textarea.value.length; var start = textarea.selectionStart; var end = textarea.selectionEnd; var selectedText = textarea.value.substring(start, end); var replacement = openTag + selectedText + closeTag; textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end, len);} wrapText(\"message\", \"[spoiler]\", \"[/spoiler]\");' title='Add Spoiler - [spoiler][/spoiler]'>Add Spoiler Tag</a></li>");
    }

    if (document.readyState === 'complete') {
      toolbar();
    }
    else {
      document.addEventListener('load', (event) => {
        toolbar();
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('.bg_addemoji, .bg_spoiler').parent().remove();
  }
}
