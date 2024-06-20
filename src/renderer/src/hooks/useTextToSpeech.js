// src/useTextToSpeech.js
const useTextToSpeech = () => {
  const speak = ({
    text = 'Sound check',
    voiceName = 'Microsoft Mark - English (United States)'
  }) => {
    const synth = window.speechSynthesis
    let voices = synth.getVoices()

    const loadVoices = () => {
      voices = synth.getVoices()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice = voices.find((v) => v.name === voiceName)
      if (voice) {
        utterance.voice = voice
      }
      synth.speak(utterance)
    }

    if (voices.length === 0 && synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        loadVoices()
        synth.onvoiceschanged = null // Remove the event listener after voices are loaded
      }
    } else {
      loadVoices()
    }
  }

  return speak
}

export default useTextToSpeech
