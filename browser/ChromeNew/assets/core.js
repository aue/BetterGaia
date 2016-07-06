class BetterGaia {
  constructor(version) {
    this.version = version;
    this.mounted = false;
  }

  mount() {
    if (this.mounted) return;
    this.sampleExtension = new Extension('mySampleExtension');
    console.log(this.sampleExtension.constructor.name);
    this.sampleExtension.mount();
    this.mounted = true;
  }

  unmount() {
    if (!this.mounted) return;
    this.sampleExtension.unmount();
    this.mounted = false;
  }
}

BG = new BetterGaia('0.0.1');
BG.mount();
