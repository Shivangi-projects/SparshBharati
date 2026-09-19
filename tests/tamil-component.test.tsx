import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach } from 'vitest'
import { describe, expect, it } from 'vitest'
import { BrailleTab } from '@/app/page'

afterEach(() => cleanup())

describe('Braille to Speak Tamil flow', () => {
  const chooseTamil = () => fireEvent.change(screen.getByLabelText('Braille language'), { target: { value: 'ta' } })
  const toggle = (dot: number) => fireEvent.click(screen.getByRole('button', { name: `Dot ${dot}` }))
  const confirm = () => fireEvent.click(screen.getByRole('button', { name: 'Confirm cell' }))
  const converted = () => screen.getByRole('heading', { name: 'Converted text' }).nextElementSibling?.textContent?.trim() ?? ''

  it('T1 maps Tamil dots 1+3 to a Tamil character', () => {
    render(<BrailleTab />)
    chooseTamil(); toggle(1); toggle(3); confirm()
    expect(converted()).toMatch(/[\u0B80-\u0BFF]/)
    expect(converted()).not.toBe('?')
  })

  it('T2 maps Tamil dots 1+3+4 to ம', () => {
    render(<BrailleTab />)
    chooseTamil(); toggle(1); toggle(3); toggle(4); confirm()
    expect(converted()).toBe('ம')
  })

  it('T3 recomputes existing cells when switching English to Tamil', () => {
    render(<BrailleTab />)
    toggle(1); toggle(3); confirm()
    expect(converted()).toBe('k')
    chooseTamil()
    expect(converted()).toBe('க')
  })

  it('T4 keeps Tamil output after Tamil to English and back', () => {
    render(<BrailleTab />)
    chooseTamil(); toggle(1); toggle(3); toggle(4); confirm()
    fireEvent.change(screen.getByLabelText('Braille language'), { target: { value: 'en' } })
    fireEvent.change(screen.getByLabelText('Braille language'), { target: { value: 'ta' } })
    expect(converted()).toBe('ம')
  })

  it('T5 joins two Tamil cells without stray characters', () => {
    render(<BrailleTab />)
    chooseTamil(); toggle(1); toggle(3); confirm(); toggle(1); toggle(3); toggle(4); confirm()
    expect(converted()).toBe('கம')
  })
})
