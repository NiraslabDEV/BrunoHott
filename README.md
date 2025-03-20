# Efeito de Rede de Partículas Interativa

Este projeto cria um efeito visual de rede de partículas coloridas que reagem ao movimento do mouse, criando uma experiência interativa e visualmente atraente.

## Características

- Partículas coloridas que se movem suavemente pela tela
- Linhas de conexão entre partículas próximas
- Interação com o movimento do mouse (ou toque em dispositivos móveis)
- Efeito de atração: as partículas seguem o movimento do mouse
- Efeito de turbilhão quando o mouse se move rapidamente
- Mudança suave de cores
- Design responsivo para funcionar bem em qualquer dispositivo

## Como usar

1. Basta abrir o arquivo `index.html` em um navegador moderno
2. Mova o mouse (ou o dedo em telas de toque) pela tela para ver o efeito interativo
3. Mova o mouse rapidamente para criar um efeito de turbilhão nas partículas
4. Observe como as partículas são atraídas e seguem o seu movimento!

## Personalização

Você pode personalizar facilmente o efeito modificando as seguintes variáveis no arquivo `script.js`:

- `particleCount`: Número de partículas (mais partículas = mais conexões, mas pode ser mais lento)
- `connectionDistance`: Distância máxima para conectar partículas com linhas
- `mouseRadius`: Raio de influência do movimento do mouse
- `colors`: Array de cores usado pelas partículas (formato RGB)
- `attractionStrength`: Força com que as partículas são atraídas pelo mouse (padrão: 1.2)

### Exemplos de personalização:

```javascript
// Mais partículas
const particleCount = 300;

// Conexões mais longas
const connectionDistance = 200;

// Área de influência do mouse maior
const mouseRadius = 300;

// Cores diferentes
const colors = [
  { r: 255, g: 0, b: 0 }, // Vermelho
  { r: 0, g: 255, b: 0 }, // Verde
  { r: 0, g: 0, b: 255 }, // Azul
  { r: 255, g: 255, b: 0 }, // Amarelo
];

// Partículas mais atraídas ao mouse
const attractionStrength = 2.0;
```

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API

## Compatibilidade

Este efeito funciona em todos os navegadores modernos que suportam HTML5 Canvas:

- Chrome (recomendado para melhor desempenho)
- Firefox
- Safari
- Edge

Em dispositivos móveis, o evento de toque é convertido para interação similar à do mouse.

---

Divirta-se com seu novo efeito visual interativo!
