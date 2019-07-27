// Put some common functions used by reducers.

import axios from 'axios'
import { PanelWithPosition } from '../type'

// API fetch.

/**
 * Get stored panels from backend server.
 * @param sortable
 */
export async function getPanels(
  sortable: boolean
): Promise<PanelWithPosition[]> {
  try {
    const res = await axios.get(process.env.API_PANELS || '/api/panels', {
      params: { sortable },
    })
    return res.data as PanelWithPosition[]
  } catch (error) {
    console.log(error)
  }
  return []
}

/**
 * Save current panels to backend server.
 * @param panels
 * @param sortable
 */
export async function setPanels(
  panels: PanelWithPosition[],
  sortable: boolean
): Promise<boolean> {
  try {
    const res = await axios.post(process.env.API_PANELS || '/api/panels', {
      panels,
      sortable,
    })
    return res.status === 200
  } catch (error) {
    console.log(error)
    return false
  }
}
