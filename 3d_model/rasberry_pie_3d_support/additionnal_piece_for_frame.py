"""Generate a small riser ("rehausseur") part for the frame (FreeCAD).

This script builds, in a new FreeCAD document, a small spacer/riser bar
drilled with two holes, used to raise or attach a part on the frame:

- a base bar (30.5 x 5 x 3 mm);
- 2 M2.5 holes (left and right) running through the bar.

Usage
-----
Run the script from the FreeCAD Python console (or via
``freecad additionnal_piece_for_frame.py``). When it finishes, the final
model is the ``CutN`` object (the last boolean cut) of the active document.

To adapt the riser to other hardware, edit the dimension values below: all
measurements are in millimeters.
"""

import FreeCAD, Part


def make_rehausseur(name="Rehausseur"):
    """Build the riser bar and return the created FreeCAD document.

    Args:
        name: Name of the FreeCAD document to create.

    Returns:
        The FreeCAD document holding the final geometry. The resulting solid
        is the last ``Part::Cut`` object added to the document.
    """
    doc = FreeCAD.newDocument(name)

    plaque = doc.addObject("Part::Box", "Rehausseur")
    plaque.Length = 30.5
    plaque.Width = 5
    plaque.Height = 3
    plaque.Placement.Base = FreeCAD.Vector(0, 0, 0)

    trous = [
        (3.5, 2.5),
        (27.0, 2.5),
    ]

    outils = []
    for i, (x, y) in enumerate(trous):
        cyl = doc.addObject("Part::Cylinder", f"Trou{i}")
        cyl.Radius = 1.35
        cyl.Height = 4
        cyl.Placement.Base = FreeCAD.Vector(x, y, -1)
        outils.append(cyl)

    resultat = plaque
    for i, outil in enumerate(outils):
        cut = doc.addObject("Part::Cut", f"Cut{i}")
        cut.Base = resultat
        cut.Tool = outil
        doc.recompute()
        resultat = cut

    doc.recompute()
    return doc


if __name__ == "__main__":
    doc = make_rehausseur()
    FreeCAD.Gui.ActiveDocument.ActiveView.fitAll()
    print("Riser created!")
