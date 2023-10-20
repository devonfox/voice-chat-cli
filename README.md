# Voice-enabled ChatGPT CLI Client

This is a cross-platform Node.js app written in TypeScript that uses OpenAI APIs to transcribe user voice audio, and responds via text in the command-line interface.

## Setting up

To install dependencies:

```
npm i
```

You will install `sox` as well. Install instructions borrowed from [node-record-lcpm16 github repo](https://github.com/gillesdemey/node-record-lpcm16/blob/master/README.md).

This module requires you to install [SoX](http://sox.sourceforge.net) and it must be available in your `$PATH`.

### For Mac OS
`brew install sox`

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
Working version for Windows is 14.4.1. You can [download the binaries](https://sourceforge.net/projects/sox/files/sox/14.4.1/) or use [chocolately](https://chocolatey.org/install) to install the package

`choco install sox.portable`

In order to use the [OpenAI API](https://openai.com/product), you will need to sign up and add credit to your account.  Then you will need to create a `.env` file in the project root containing your openAPI key like so.

```
OPENAI_API_KEY=<put_your_key_here>
```


Then to compile TypeScript project:

```
npx tsc
```

To run the project after compilation:

```
node dist/index.js
```

Once running, simply say, "Goodbye" to exit the program.
