import { CSSProperties } from 'react'
import styled from 'styled-components'

export const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 5px;
`

export const sectionSubtitle: CSSProperties = {
  display: 'flex',
  fontSize: '12px',
  color: '#515151',
  fontWeight: 'bold',
  justifyContent: 'flex-start',
}

export const SectionSubtitle = styled.div`
  display: flex;
  font-size: 12px;
  color: #515151;
  font-weight: bold;
  justify-content: flex-start;
`
